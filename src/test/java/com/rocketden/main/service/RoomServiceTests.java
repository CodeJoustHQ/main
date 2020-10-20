package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.ProblemDifficulty;
import com.rocketden.main.model.Room;

import com.rocketden.main.model.User;
import com.rocketden.main.util.Utility;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.junit.Assert.assertEquals;
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
    private SocketService socketService;

    @Mock
    private SimpMessagingTemplate template;

    @Mock
    private Utility utility;

    @Spy
    @InjectMocks
    private RoomService roomService;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String NICKNAME_3 = "rocketandrocket";
    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "678910";

    @Test
    public void createRoomSuccess() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME);
        CreateRoomRequest request = new CreateRoomRequest();
        request.setHost(user);
        
        // Mock generateUniqueId to return a custom room id
        Mockito.doReturn(ROOM_ID).when(utility).generateUniqueId(eq(RoomService.ROOM_ID_LENGTH), eq(Utility.ROOM_ID_KEY));

        // Mock generateUniqueId to return a custom user id
        Mockito.doReturn(USER_ID).when(utility).generateUniqueId(eq(UserService.USER_ID_LENGTH), eq(Utility.USER_ID_KEY));

        // Verify create room request succeeds and returns correct response
        RoomDto response = roomService.createRoom(request);

        verify(repository).save(Mockito.any(Room.class));
        assertEquals(ROOM_ID, response.getRoomId());
        assertEquals(user.getNickname(), response.getHost().getNickname());
        assertEquals(USER_ID, response.getHost().getUserId());
        assertEquals(ProblemDifficulty.RANDOM, response.getDifficulty());
    }

    @Test
    public void joinRoomSuccess() {
        // Verify join room request succeeds and returns correct response
        User user = new User();
        user.setNickname(NICKNAME);
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(user));

        // Mock generateUniqueId to return a custom user id
        Mockito.doReturn(USER_ID).when(utility).generateUniqueId(eq(UserService.USER_ID_LENGTH), eq(Utility.USER_ID_KEY));

        Room room = new Room();
        room.setRoomId(ROOM_ID);

        // Create host
        User host = new User();
        host.setNickname(NICKNAME_2);
        room.addUser(host);
        room.setHost(host);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        RoomDto response = roomService.joinRoom(ROOM_ID, request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(ROOM_ID, response.getRoomId());
        assertEquals(2, response.getUsers().size());
        assertEquals(host.getNickname(), response.getUsers().get(0).getNickname());
        assertEquals(user.getNickname(), response.getUsers().get(1).getNickname());
        assertEquals(USER_ID, response.getUsers().get(1).getUserId());
        assertEquals(ProblemDifficulty.RANDOM, response.getDifficulty());
    }

    @Test
    public void joinRoomNonexistentFailure() {
        // Verify join room request fails when room does not exist
        User user = new User();
        user.setNickname(NICKNAME);
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(user));

        // Mock repository to return room when called
        Mockito.doReturn(null).when(repository).findRoomByRoomId(eq(ROOM_ID));

        // Assert that service.joinRoom(request) throws the correct exception
        ApiException exception = assertThrows(ApiException.class, () -> roomService.joinRoom(ROOM_ID, request));

        verify(repository).findRoomByRoomId(ROOM_ID);
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void joinRoomDuplicateUserFailure() {
        /**
         * Verify join room request fails when user with same features 
         * is already present
         * Define two identical, and make the first one the host and 
         * second one the joiner
         */
        User firstUser = new User();
        firstUser.setNickname(NICKNAME);
        UserDto newUser = new UserDto();
        newUser.setNickname(NICKNAME);

        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(newUser);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(firstUser);
        room.addUser(firstUser);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        ApiException exception = assertThrows(ApiException.class, () -> roomService.joinRoom(ROOM_ID, request));

        verify(repository).findRoomByRoomId(ROOM_ID);
        assertEquals(RoomError.DUPLICATE_USERNAME, exception.getError());
    }

    @Test
    public void getRoomSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        RoomDto response = roomService.getRoom(ROOM_ID);

        assertEquals(ROOM_ID, response.getRoomId());
        assertEquals(room.getHost(), UserMapper.toEntity(response.getHost()));

        List<User> actual = response.getUsers().stream()
                .map(UserMapper::toEntity).collect(Collectors.toList());
        assertEquals(room.getUsers(), actual);
    }

    @Test
    public void getRoomFailure() {
        ApiException exception = assertThrows(ApiException.class, () -> roomService.getRoom(ROOM_ID));

        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void changeRoomHostSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        User user =  new User();
        user.setNickname(NICKNAME_2);

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setNewHost(UserMapper.toDto(user));

        RoomDto response = roomService.updateRoomHost(room.getRoomId(), request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(user, UserMapper.toEntity(response.getHost()));
    }

    @Test
    public void changeRoomHostFailure() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        User user =  new User();
        user.setNickname(NICKNAME_2);

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        // Invalid permissions
        UpdateHostRequest invalidPermRequest = new UpdateHostRequest();
        invalidPermRequest.setInitiator(UserMapper.toDto(user));
        invalidPermRequest.setNewHost(UserMapper.toDto(host));

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost(ROOM_ID, invalidPermRequest));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());

        // Nonexistent room
        UpdateHostRequest noRoomRequest = new UpdateHostRequest();
        noRoomRequest.setInitiator(UserMapper.toDto(host));
        noRoomRequest.setNewHost(UserMapper.toDto(user));

        exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost("999999", noRoomRequest));
        assertEquals(RoomError.NOT_FOUND, exception.getError());

        // Nonexistent new host
        UpdateHostRequest noUserRequest = new UpdateHostRequest();
        noUserRequest.setInitiator(UserMapper.toDto(host));

        UserDto nonExistentUser = new UserDto();
        nonExistentUser.setNickname(NICKNAME_3);
        noUserRequest.setNewHost(nonExistentUser);

        exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost(ROOM_ID, noUserRequest));
        assertEquals(UserError.NOT_FOUND, exception.getError());
    }

    @Test
    public void updateRoomSettingsSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setDifficulty(ProblemDifficulty.EASY);

        RoomDto response = roomService.updateRoomSettings(room.getRoomId(), request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(request.getDifficulty(), response.getDifficulty());
    }

    @Test
    public void updateRoomSettingsInvalidPermissions() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        User user =  new User();
        user.setNickname(NICKNAME_2);

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        // Invalid permissions
        UpdateSettingsRequest invalidPermRequest = new UpdateSettingsRequest();
        invalidPermRequest.setInitiator(UserMapper.toDto(user));
        invalidPermRequest.setDifficulty(ProblemDifficulty.MEDIUM);

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomSettings(ROOM_ID, invalidPermRequest));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void updateRoomSettingsNoRoomFound() {
        UserDto userDto = new UserDto();
        userDto.setNickname(NICKNAME);

        // Non-existent room
        UpdateSettingsRequest noRoomRequest = new UpdateSettingsRequest();
        noRoomRequest.setInitiator(userDto);
        noRoomRequest.setDifficulty(ProblemDifficulty.HARD);

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomSettings("999999", noRoomRequest));
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }
}
