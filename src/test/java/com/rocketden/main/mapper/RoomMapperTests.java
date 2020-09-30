package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.Set;
import java.util.stream.Collectors;

@SpringBootTest
public class RoomMapperTests {

    @Test
    public void entityToDto() {
        User host = new User();
        host.setNickname("rocket");

        Room room = new Room();
        room.setRoomId("012345");
        room.setHost(host);

        room.addUser(host);
        room.addUser(new User());

        RoomDto response = RoomMapper.toDto(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());

        User actualHost = UserMapper.toEntity(response.getHost());
        assertEquals(room.getHost(), actualHost);

        // Map set of UserDtos to set of Users
        Set<User> actualUsers = response.getUsers()
                .stream()
                .map(UserMapper::toEntity)
                .collect(Collectors.toSet());
        assertEquals(room.getUsers(), actualUsers);
    }

    @Test
    public void nullRoomMappings() {
        assertNull(RoomMapper.toDto(null));
    }
}
