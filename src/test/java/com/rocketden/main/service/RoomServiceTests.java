package com.rocketden.main.service;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.ProblemDifficulty;
import com.rocketden.main.model.Room;

import com.rocketden.main.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.stream.Collectors;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTests {

    @Mock
    private RoomRepository repository;

    @Mock
    private SimpMessagingTemplate template;

    @Spy
    @InjectMocks
    private RoomService service;

    @Test
    public void createRoomSuccess() {
        UserDto user = new UserDto();
        user.setNickname("rocket");
        CreateRoomRequest request = new CreateRoomRequest();
        request.setHost(user);
        // Verify create room request succeeds and returns correct response
        // Mock generateRoomId to return a custom room id
        Mockito.doReturn("012345").when(service).generateRoomId();
        RoomDto response = service.createRoom(request);

        verify(repository).save(Mockito.any(Room.class));
        assertEquals("012345", response.getRoomId());
        assertEquals(user, response.getHost());
        assertNull(response.getDifficulty());
    }

    @Test
    public void joinRoomSuccess() {
        // Verify join room request succeeds and returns correct response
        String roomId = "012345";

        User user = new User();
        user.setNickname("rocket");
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(user));
        request.setRoomId(roomId);

        Room room = new Room();
        room.setRoomId(roomId);

        // Create host
        User host = new User();
        host.setNickname("host");
        room.addUser(host);
        room.setHost(host);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        RoomDto response = service.joinRoom(request);

        assertEquals(roomId, response.getRoomId());
        assertEquals(2, response.getUsers().size());
        assertTrue(response.getUsers().contains(request.getUser()));
        assertNull(response.getDifficulty());

        verify(template).convertAndSend(
                 eq(String.format(BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user", response.getRoomId())),
                 eq(response));
    }

    @Test
    public void joinRoomNonexistentFailure() {
        // Verify join room request fails when room does not exist
        String roomId = "012345";

        User user = new User();
        user.setNickname("rocket");
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(user));
        request.setRoomId(roomId);

        // Mock repository to return room when called
        Mockito.doReturn(null).when(repository).findRoomByRoomId(eq(roomId));

        // Assert that service.joinRoom(request) throws the correct exception
        ApiException exception = assertThrows(ApiException.class, () -> service.joinRoom(request));

        verify(repository).findRoomByRoomId(roomId);
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void joinRoomDuplicateUserFailure() {
        // Verify join room request fails when user with same features is already present
        String roomId = "012345";

        // Define two identical, and make the first one the host and second one the joiner
        User firstUser = new User();
        firstUser.setNickname("rocket");
        UserDto newUser = new UserDto();
        newUser.setNickname("rocket");

        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(newUser);
        request.setRoomId(roomId);

        Room room = new Room();
        room.setRoomId(roomId);
        room.setHost(firstUser);
        room.addUser(firstUser);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        ApiException exception = assertThrows(ApiException.class, () -> service.joinRoom(request));

        verify(repository).findRoomByRoomId(roomId);
        assertEquals(RoomError.USER_ALREADY_PRESENT, exception.getError());
    }

    @Test
    public void getRoomSuccess() {
        String roomId = "012345";
        Room room = new Room();
        room.setRoomId(roomId);

        User host = new User();
        host.setNickname("test");

        room.setHost(host);
        room.addUser(host);

        GetRoomRequest request = new GetRoomRequest();
        request.setRoomId(roomId);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        RoomDto response = service.getRoom(request);

        assertEquals(roomId, response.getRoomId());
        assertEquals(room.getHost(), UserMapper.toEntity(response.getHost()));

        List<User> actual = response.getUsers().stream()
                .map(UserMapper::toEntity).collect(Collectors.toList());
        assertEquals(room.getUsers(), actual);
    }

    @Test
    public void getRoomFailure() {
        GetRoomRequest request = new GetRoomRequest();
        request.setRoomId("987654");

        ApiException exception = assertThrows(ApiException.class, () -> service.getRoom(request));

        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void changeRoomHostSuccess() {
        String roomId = "012345";
        Room room = new Room();
        room.setRoomId(roomId);

        User host = new User();
        host.setNickname("host");
        User user =  new User();
        user.setNickname("user");

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setNewHost(UserMapper.toDto(user));

        RoomDto response = service.updateRoomHost(room.getRoomId(), request);

        assertEquals(user, UserMapper.toEntity(response.getHost()));

        verify(template).convertAndSend(
                eq(String.format(BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user", response.getRoomId())),
                eq(response));
    }

    @Test
    public void changeRoomHostFailure() {
        String roomId = "012345";
        Room room = new Room();
        room.setRoomId(roomId);

        User host = new User();
        host.setNickname("host");
        User user =  new User();
        user.setNickname("user");

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));

        // Invalid permissions
        UpdateHostRequest invalidPermRequest = new UpdateHostRequest();
        invalidPermRequest.setInitiator(UserMapper.toDto(user));
        invalidPermRequest.setNewHost(UserMapper.toDto(host));

        ApiException exception = assertThrows(ApiException.class, () ->
                service.updateRoomHost(room.getRoomId(), invalidPermRequest));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());

        // Nonexistent room
        UpdateHostRequest noRoomRequest = new UpdateHostRequest();
        noRoomRequest.setInitiator(UserMapper.toDto(host));
        noRoomRequest.setNewHost(UserMapper.toDto(user));

        exception = assertThrows(ApiException.class, () ->
                service.updateRoomHost("999999", noRoomRequest));
        assertEquals(RoomError.NOT_FOUND, exception.getError());

        // Nonexistent new host
        UpdateHostRequest noUserRequest = new UpdateHostRequest();
        noUserRequest.setInitiator(UserMapper.toDto(host));

        UserDto nonExistentUser = new UserDto();
        nonExistentUser.setNickname("notfound");
        noUserRequest.setNewHost(nonExistentUser);

        exception = assertThrows(ApiException.class, () ->
                service.updateRoomHost(room.getRoomId(), noUserRequest));
        assertEquals(UserError.NOT_FOUND, exception.getError());
    }

    @Test
    public void updateRoomSettingsSuccess() {
        String roomId = "012345";
        Room room = new Room();
        room.setRoomId(roomId);

        User host = new User();
        host.setNickname("host");

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setDifficulty(ProblemDifficulty.EASY);

        RoomDto response = service.updateRoomSettings(room.getRoomId(), request);

        assertEquals(request.getDifficulty(), response.getDifficulty());

        verify(template).convertAndSend(
                eq(String.format(BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user", response.getRoomId())),
                eq(response));
    }

    @Test
    public void updateRoomSettingsInvalidPermissions() {
        String roomId = "012345";
        Room room = new Room();
        room.setRoomId(roomId);

        User host = new User();
        host.setNickname("host");
        User user =  new User();
        user.setNickname("user");

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));

        // Invalid permissions
        UpdateSettingsRequest invalidPermRequest = new UpdateSettingsRequest();
        invalidPermRequest.setInitiator(UserMapper.toDto(user));
        invalidPermRequest.setDifficulty(ProblemDifficulty.MEDIUM);

        ApiException exception = assertThrows(ApiException.class, () ->
                service.updateRoomSettings(room.getRoomId(), invalidPermRequest));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void updateRoomSettingsNoRoomFound() {
        UserDto userDto = new UserDto();
        userDto.setNickname("test");

        // Non-existent room
        UpdateSettingsRequest noRoomRequest = new UpdateSettingsRequest();
        noRoomRequest.setInitiator(userDto);
        noRoomRequest.setDifficulty(ProblemDifficulty.HARD);

        ApiException exception = assertThrows(ApiException.class, () ->
                service.updateRoomSettings("999999", noRoomRequest));
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }


    @Test
    public void sendSocketUpdate() {
        RoomDto roomDto = new RoomDto();
        roomDto.setRoomId("123456");
        UserDto userDto = new UserDto();
        userDto.setNickname("test");
        roomDto.setHost(userDto);

        service.sendSocketUpdate(roomDto);
        verify(template).convertAndSend(
                eq(String.format(BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user", roomDto.getRoomId())),
                eq(roomDto));
    }

    @Test
    public void generateValidRoomId() {
        // Verify room ids are generated correctly
        String roomId = service.generateRoomId();

        assertEquals(RoomService.ROOM_ID_LENGTH, roomId.length());

        for (char c : roomId.toCharArray()) {
            assertTrue(c >= '0');
            assertTrue(c <= '9');
        }
    }
}
