package com.rocketden.main.service;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
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
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.Set;
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
        room.setHost(host);
        room.addUser(host);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        RoomDto response = service.joinRoom(request);

        assertEquals(roomId, response.getRoomId());
        assertEquals(2, response.getUsers().size());
        assertTrue(response.getUsers().contains(request.getUser()));

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
        User secondUser = new User();
        secondUser.setNickname("rocket");

        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(secondUser));
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

        Set<User> actual = response.getUsers().stream()
                .map(UserMapper::toEntity).collect(Collectors.toSet());
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

    }

    @Test
    public void changeRoomHostFailure() {

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
