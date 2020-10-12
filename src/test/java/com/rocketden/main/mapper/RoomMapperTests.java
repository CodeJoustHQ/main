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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootTest
public class RoomMapperTests {

    @Test
    public void entityToDto() {
        User host = new User();
        host.setNickname("rocket");
        User user = new User();
        user.setNickname("test");
        user.setSessionId("678910");

        Room room = new Room();
        room.setRoomId("012345");
        room.setHost(host);

        room.addUser(host);
        room.addUser(user);

        RoomDto response = RoomMapper.toDto(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
        assertEquals(room.getDifficulty(), response.getDifficulty());

        User actualHost = UserMapper.toEntity(response.getHost());
        assertEquals(room.getHost(), actualHost);

        // Map set of UserDtos to set of Users
        List<User> actualUsers = response.getUsers()
                .stream()
                .map(UserMapper::toEntity)
                .collect(Collectors.toList());
        assertEquals(room.getUsers(), actualUsers);

        // Map set of UserDtos on inactive users to a set of Users
        List<User> expectedInactiveUsers = new ArrayList<>();
        expectedInactiveUsers.add(host);
        List<User> actualInactiveUsers = response.getInactiveUsers()
                .stream()
                .map(UserMapper::toEntity)
                .collect(Collectors.toList());
        assertEquals(expectedInactiveUsers, actualInactiveUsers);

        // Map set of UserDtos on active users to a set of Users
        List<User> expectedActiveUsers = new ArrayList<>();
        expectedActiveUsers.add(user);
        List<User> actualActiveUsers = response.getActiveUsers()
                .stream()
                .map(UserMapper::toEntity)
                .collect(Collectors.toList());
        assertEquals(expectedActiveUsers, actualActiveUsers);
    }

    @Test
    public void nullRoomMappings() {
        assertNull(RoomMapper.toDto(null));
    }
}
