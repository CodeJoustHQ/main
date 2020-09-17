package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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

        UserDto expectedHost = UserMapper.toDto(room.getHost());
        assertEquals(expectedHost, response.getHost());

        // Map set of Users to set of UserDtos
        Set<UserDto> expectedUsers = room.getUsers()
                .stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toSet());
        assertEquals(expectedUsers, response.getUsers());
    }
}
