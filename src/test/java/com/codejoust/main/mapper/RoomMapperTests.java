package com.codejoust.main.mapper;

import com.codejoust.main.model.problem.ProblemIOType;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.dto.room.RoomMapper;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemDifficulty;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class RoomMapperTests {

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "678910";
    private static final String SESSION_ID = "234567";
    private static final String ROOM_ID = "012345";

    private static final String PROBLEM_ID = "abcdef";
    private static final String PROBLEM_NAME = "name1";
    private static final ProblemDifficulty PROBLEM_DIFFICULTY = ProblemDifficulty.EASY;
    private static final String PROBLEM_ID_2 = "ghijkl";
    private static final String PROBLEM_NAME_2 = "name2";
    private static final ProblemDifficulty PROBLEM_DIFFICULTY_2 = ProblemDifficulty.HARD;

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
        room.setNumProblems(3);

        Problem problem1 = new Problem();
        problem1.setProblemId(PROBLEM_ID);
        problem1.setName(PROBLEM_NAME);
        problem1.setDifficulty(PROBLEM_DIFFICULTY);
        problem1.setDescription("irrelevant");

        Problem problem2 = new Problem();
        problem1.setProblemId(PROBLEM_ID_2);
        problem1.setName(PROBLEM_NAME_2);
        problem1.setDifficulty(PROBLEM_DIFFICULTY_2);
        problem1.setOutputType(ProblemIOType.INTEGER);

        room.setProblems(Arrays.asList(problem1, problem2));

        room.addUser(host);
        room.addUser(user);

        RoomDto response = RoomMapper.toDto(room);

        assertNotNull(response);
        assertEquals(room.getRoomId(), response.getRoomId());
        assertEquals(room.getDifficulty(), response.getDifficulty());
        assertEquals(room.getDuration(), response.getDuration());
        assertEquals(room.getNumProblems(), response.getNumProblems());

        assertEquals(room.getProblems().size(), response.getProblems().size());
        assertEquals(problem1.getProblemId(), response.getProblems().get(0).getProblemId());
        assertEquals(problem1.getName(), response.getProblems().get(0).getName());
        assertEquals(problem2.getDifficulty(), response.getProblems().get(1).getDifficulty());

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
