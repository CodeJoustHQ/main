package com.codejoust.main.mapper;

import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.util.TestFields;
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

    @Test
    public void entityToDto() {
        User host = new User();
        host.setNickname(TestFields.NICKNAME);
        host.setUserId(TestFields.USER_ID);
        User user = new User();
        user.setNickname(TestFields.NICKNAME_2);
        user.setUserId(TestFields.USER_ID_2);
        user.setSessionId(TestFields.SESSION_ID);

        Room room = new Room();
        room.setRoomId(TestFields.ROOM_ID);
        room.setDifficulty(ProblemDifficulty.MEDIUM);
        room.setHost(host);
        room.setNumProblems(3);

        Problem problem1 = new Problem();
        problem1.setProblemId(TestFields.PROBLEM_ID);
        problem1.setName(TestFields.PROBLEM_NAME);
        problem1.setDifficulty(ProblemDifficulty.EASY);
        problem1.setDescription("irrelevant");

        Problem problem2 = new Problem();
        problem1.setProblemId(TestFields.PROBLEM_ID_2);
        problem1.setName(TestFields.PROBLEM_NAME_2);
        problem1.setDifficulty(ProblemDifficulty.HARD);
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
