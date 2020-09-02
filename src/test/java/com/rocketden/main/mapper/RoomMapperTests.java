package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.CreateRoomMapper;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomMapper;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.model.Room;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@SpringBootTest
public class RoomMapperTests {

    @Test
    public void createRoomRequestToEntity() {
        CreateRoomRequest request = new CreateRoomRequest();
        Room entity = CreateRoomMapper.requestToEntity(request);

        assertNotNull(entity);
        assertNotNull(entity.getId());
        assertNotNull(entity.getCreatedDate());
    }

    @Test
    public void entityToCreateRoomResponse() {
        Room room = new Room();
        room.setRoomId("012345");

        CreateRoomResponse response = CreateRoomMapper.entityToResponse(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
    }

    @Test
    public void entityToJoinRoomResponse() {
        Room room = new Room();
        room.setRoomId("012345");

        JoinRoomResponse response = JoinRoomMapper.entityToResponse(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
    }
}
