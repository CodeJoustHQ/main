package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.model.Room;
import org.junit.Before;
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

@ExtendWith(MockitoExtension.class)
public class RoomServiceTests {

    @Mock
    private RoomRepository repository;

    @Spy
    @InjectMocks
    private RoomService service;

    @Before
    public void setUp() {
        service = new RoomService(repository);
    }

    @Test
    public void createRoomSuccess() {
        // Verify create room request succeeds and returns correct response
        // Mock generateRoomId to return a custom room id
        Mockito.doReturn("012345").when(service).generateRoomId();
        CreateRoomResponse response = service.createRoom();

        verify(repository).save(Mockito.any(Room.class));
        assertEquals(CreateRoomResponse.SUCCESS, response.getMessage());
        assertEquals("012345", response.getRoomId());
    }

    @Test
    public void joinRoomSuccess() {
        // Verify join room request succeeds and returns correct response
        String roomId = "012345";

        JoinRoomRequest request = new JoinRoomRequest();
        request.setPlayerName("rocket");
        request.setRoomId(roomId);

        Room room = new Room();
        room.setRoomId(roomId);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(roomId));
        JoinRoomResponse response = service.joinRoom(request);

        assertEquals(JoinRoomResponse.SUCCESS, response.getMessage());
        assertEquals(roomId, response.getRoomId());
        assertEquals(request.getPlayerName(), response.getPlayerName());
    }

    @Test
    public void joinRoomFailure() {
        // Verify join room request fails when room does not exist
        String roomId = "012345";

        JoinRoomRequest request = new JoinRoomRequest();
        request.setPlayerName("rocket");
        request.setRoomId(roomId);

        // Mock repository to return room when called
        Mockito.doReturn(null).when(repository).findRoomByRoomId(eq(roomId));
        JoinRoomResponse response = service.joinRoom(request);

        verify(repository).findRoomByRoomId(roomId);
        assertEquals(JoinRoomResponse.ERROR_NOT_FOUND, response.getMessage());
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
