package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.HashSet;
import java.util.Set;

@SpringBootTest
public class RoomMapperTests {

    @Test
    public void entityToCreateRoomResponse() {
        User host = new User();
        host.setNickname("rocket");
        Set<User> users = new HashSet<User>();
        users.add(host);
        Room room = new Room();
        room.setRoomId("012345");
        room.setHost(host);
        room.setUsers(users);

        CreateRoomResponse response = RoomMapper.entityToCreateResponse(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
        assertEquals(room.getHost(), response.getHost());
    }

    @Test
    public void entityToJoinRoomResponse() {
        User host = new User();
        host.setNickname("rocket");
        Set<User> users = new HashSet<User>();
        users.add(host);
        Room room = new Room();
        room.setRoomId("012345");
        room.setHost(host);
        room.setUsers(users);

        JoinRoomResponse response = RoomMapper.entityToJoinResponse(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
        assertEquals(room.getUsers(), response.getUsers());
    }
}
