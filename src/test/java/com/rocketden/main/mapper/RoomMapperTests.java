package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.RoomDto;
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
    public void entityToDto() {
        User host = new User();
        host.setNickname("rocket");

        Set<User> users = new HashSet<>();
        users.add(host);
        users.add(new User());

        Room room = new Room();
        room.setRoomId("012345");
        room.setHost(host);
        room.setUsers(users);

        RoomDto response = RoomMapper.toDto(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
        assertEquals(room.getHost(), response.getHost());
        assertEquals(room.getUsers(), response.getUsers());
    }
}
