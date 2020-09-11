package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.HashSet;
import java.util.Set;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTests {

    @Mock
    private RoomRepository repository;

    @Spy
    @InjectMocks
    private RoomService service;

    @Test
    public void createRoomSuccess() {
        User user = new User();
        user.setNickname("rocket");
        CreateRoomRequest request = new CreateRoomRequest();
        request.setHost(user);
        // Verify create room request succeeds and returns correct response
        // Mock generateRoomId to return a custom room id
        Mockito.doReturn("012345").when(service).generateRoomId();
        CreateRoomResponse response = service.createRoom(request);

        verify(repository).save(Mockito.any(Room.class));
        assertEquals(CreateRoomResponse.SUCCESS, response.getMessage());
        assertEquals("012345", response.getRoomId());
    }

    @Test
    public void joinRoomSuccess() {
        // Verify join room request succeeds and returns correct response
        String roomId = "012345";

        // Create host and users objects.
        User host = new User();
        host.setNickname("host");
        Set<User> users = new HashSet<>();
        users.add(host);

        User user = new User();
        user.setNickname("rocket");
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(user);
        request.setRoomId(roomId);

        Room room = new Room();
        room.setRoomId(roomId);
        room.setHost(host);
        room.setUsers(users);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        JoinRoomResponse response = service.joinRoom(request);

        assertEquals(JoinRoomResponse.SUCCESS, response.getMessage());
        assertEquals(roomId, response.getRoomId());
        assertTrue(response.getUsers().contains(request.getUser()));
    }

    @Test
    public void joinRoomNonexistentFailure() {
        // Verify join room request fails when room does not exist
        String roomId = "012345";

        User user = new User();
        user.setNickname("rocket");
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(user);
        request.setRoomId(roomId);

        // Mock repository to return room when called
        Mockito.doReturn(null).when(repository).findRoomByRoomId(eq(roomId));
        JoinRoomResponse response = service.joinRoom(request);

        verify(repository).findRoomByRoomId(roomId);
        assertEquals(JoinRoomResponse.ERROR_NOT_FOUND, response.getMessage());
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
        Set<User> users = new HashSet<>();
        users.add(firstUser);
        
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(secondUser);
        request.setRoomId(roomId);

        Room room = new Room();
        room.setRoomId(roomId);
        room.setHost(firstUser);
        room.setUsers(users);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        JoinRoomResponse response = service.joinRoom(request);

        verify(repository).findRoomByRoomId(roomId);
        assertEquals(JoinRoomResponse.ERROR_USER_ALREADY_PRESENT, response.getMessage());
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
