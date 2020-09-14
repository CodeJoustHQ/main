package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.model.Room;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@SpringBootTest
public class RoomMapperTests {

    @Test
    public void entityToCreateRoomResponse() {
        Room room = new Room();
        room.setRoomId("012345");

        CreateRoomResponse response = RoomMapper.entityToCreateResponse(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
    }

    @Test
    public void entityToJoinRoomResponse() {
        Room room = new Room();
        room.setRoomId("012345");

        JoinRoomResponse response = RoomMapper.entityToJoinResponse(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
    }
}
