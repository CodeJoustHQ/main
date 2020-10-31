package com.rocketden.main.mapper;

import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.problem.ProblemDifficulty;
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

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "678910";
    private static final String SESSION_ID = "234567";
    private static final String ROOM_ID = "012345";

    @Test
    public void entityToDto() {
        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        User user = new User();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        user.setSessionId(SESSION_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.MEDIUM);
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
