package com.codejoust.main.api;

import com.codejoust.main.dto.problem.SelectableProblemDto;
import com.codejoust.main.dto.room.CreateRoomRequest;
import com.codejoust.main.dto.room.DeleteRoomRequest;
import com.codejoust.main.dto.room.JoinRoomRequest;
import com.codejoust.main.dto.room.RemoveUserRequest;
import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.dto.room.UpdateSettingsRequest;
import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.RoomError;
import com.codejoust.main.exception.UserError;
import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;
import com.codejoust.main.game_object.GameTimer;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.util.MockHelper;
import com.codejoust.main.util.ProblemTestMethods;
import com.codejoust.main.util.RoomTestMethods;
import com.codejoust.main.util.TestFields;
import com.codejoust.main.util.TestUrls;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class RoomTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getNonExistentRoom() throws Exception {
        ApiError ERROR = RoomError.NOT_FOUND;

        // Passing in nonexistent roomId should return 404
        ApiErrorResponse actual = MockHelper.getRequest(this.mockMvc, TestUrls.getRoom(TestFields.ROOM_ID), ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);

        // Passing in no roomId should result in same 404 error
        actual = MockHelper.getRequest(this.mockMvc, TestUrls.getRoom(" "), ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void joinNonExistentRoom() throws Exception {
        UserDto user = TestFields.userDto1();

        // PUT request to join non-existent room should fail
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(user);

        ApiError ERROR = RoomError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.updateHost(TestFields.ROOM_ID), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndGetValidRoom() throws Exception {
        // POST request to create valid room should return successful response
        UserDto host = TestFields.userDto1();
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        RoomDto expected = new RoomDto();
        expected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        expected.setUsers(users);

        RoomDto actual = MockHelper.postRequest(this.mockMvc, TestUrls.createRoom(), createRequest, RoomDto.class, HttpStatus.CREATED);

        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
        assertEquals(ProblemDifficulty.RANDOM, actual.getDifficulty());
        assertEquals(0, actual.getProblems().size());

        // Send GET request to validate that room exists
        String roomId = actual.getRoomId();
        expected.setRoomId(roomId);
        RoomDto actualGet = MockHelper.getRequest(this.mockMvc, TestUrls.getRoom(actual.getRoomId()), RoomDto.class, HttpStatus.OK);

        assertEquals(expected.getRoomId(), actualGet.getRoomId());
        assertEquals(expected.getHost(), actualGet.getHost());
        assertEquals(expected.getUsers(), actualGet.getUsers());
        assertEquals(ProblemDifficulty.RANDOM, actual.getDifficulty());
        assertEquals(0, actual.getProblems().size());
    }

    @Test
    public void createValidRoomNoHost() throws Exception {
        // POST request to create valid room should return successful response
        CreateRoomRequest createRequest = new CreateRoomRequest();

        ApiError ERROR = RoomError.NO_HOST;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createRoom(), createRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinRoom() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = TestFields.userDto1();
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        RoomDto createActual = MockHelper.postRequest(this.mockMvc, TestUrls.createRoom(), createRequest, RoomDto.class, HttpStatus.CREATED);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // Create User and List<User> for PUT request
        UserDto user = TestFields.userDto2();
        users = new ArrayList<>();
        users.add(host);
        users.add(user);

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        RoomDto expected = new RoomDto();
        expected.setHost(host);
        expected.setUsers(users);
        expected.setRoomId(roomId);

        RoomDto actual = MockHelper.putRequest(this.mockMvc, TestUrls.joinRoom(createActual.getRoomId()), joinRequest, RoomDto.class, HttpStatus.OK);

        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
    }

    @Test
    public void createAndJoinRoomUserAlreadyExists() throws Exception {
        /**
         * POST request to create room and PUT request to join room should fail
         * because the room already has a user with the exact same information
         */
        UserDto host = TestFields.userDto1();
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        RoomDto createActual = MockHelper.postRequest(this.mockMvc, TestUrls.createRoom(), createRequest, RoomDto.class, HttpStatus.CREATED);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(host);

        ApiError ERROR = RoomError.DUPLICATE_USERNAME;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.joinRoom(roomId), joinRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinRoomNoUser() throws Exception {
        // POST request to create room and PUT request to join room, without set user, should fail
        UserDto host = TestFields.userDto1();
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        RoomDto createActual = MockHelper.postRequest(this.mockMvc, TestUrls.createRoom(), createRequest, RoomDto.class, HttpStatus.CREATED);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();

        ApiError ERROR = UserError.INVALID_USER;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.joinRoom(roomId), joinRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinFullRoom() throws Exception {
        // 1. Create room with one user and PUT request to set size to 1
        UserDto host = TestFields.userDto1();
        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setSize(1);

        room = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, RoomDto.class, HttpStatus.OK);

        assertEquals(updateRequest.getSize(), room.getSize());

        // Get id of created room to join
        String roomId = room.getRoomId();

        // 2. Send PUT request and verify that ALREADY_FULL exception was thrown
        JoinRoomRequest joinRequest = new JoinRoomRequest();

        ApiError ERROR = RoomError.ALREADY_FULL;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.joinRoom(roomId), joinRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsSuccess() throws Exception {
        UserDto host = TestFields.userDto1();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        assertEquals(ProblemDifficulty.RANDOM, room.getDifficulty());

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDifficulty(ProblemDifficulty.EASY);
        updateRequest.setDuration(TestFields.DURATION);
        updateRequest.setNumProblems(2);
        updateRequest.setSize(6);

        room = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, RoomDto.class, HttpStatus.OK);

        assertEquals(updateRequest.getDifficulty(), room.getDifficulty());

        // Confirm with a GET that the room has actually been updated in the database
        RoomDto actual = MockHelper.getRequest(this.mockMvc, TestUrls.getRoom(room.getRoomId()), RoomDto.class, HttpStatus.OK);

        assertEquals(updateRequest.getDifficulty(), actual.getDifficulty());
        assertEquals(updateRequest.getDuration(), actual.getDuration());
        assertEquals(updateRequest.getNumProblems(), actual.getNumProblems());
        assertEquals(updateRequest.getSize(), actual.getSize());
    }

    @Test
    public void updateRoomSettingInvalidSize() throws Exception {
        // 1. Create room with two users and PUT request to set size to 1
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(mockMvc, host, user);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setSize(1);

        ApiError ERROR = RoomError.BAD_ROOM_SIZE;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual, actual.getType());
    }

    @Test
    public void updateRoomSettingsProblems() throws Exception {
        UserDto host = TestFields.userDto1();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        String problemId1 = ProblemTestMethods.createSingleProblem(this.mockMvc).getProblemId();
        String problemId2 = ProblemTestMethods.createSingleProblem(this.mockMvc).getProblemId();

        SelectableProblemDto problemDto1 = new SelectableProblemDto();
        problemDto1.setProblemId(problemId1);
        SelectableProblemDto problemDto2 = new SelectableProblemDto();
        problemDto2.setProblemId(problemId2);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setNumProblems(2);
        updateRequest.setProblems(Arrays.asList(problemDto1, problemDto2));

        room = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, RoomDto.class, HttpStatus.OK);

        assertEquals(2, room.getNumProblems());
        assertEquals(2, room.getProblems().size());
        assertEquals(problemDto1.getProblemId(), room.getProblems().get(0).getProblemId());
        assertEquals(problemDto1.getProblemId(), room.getProblems().get(0).getProblemId());
        assertNotNull(room.getProblems().get(0).getName());
        assertNotNull(room.getProblems().get(0).getDifficulty());

        // Clear problems list
        updateRequest.setNumProblems(1);
        updateRequest.setProblems(new ArrayList<>());

        room = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, RoomDto.class, HttpStatus.OK);

        assertEquals(1, room.getNumProblems());
        assertTrue(room.getProblems().isEmpty());
    }

    @Test
    public void updateRoomSettingsProblemNotFound() throws Exception {
        UserDto host = TestFields.userDto1();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        SelectableProblemDto problemDto = new SelectableProblemDto();
        problemDto.setProblemId("random-string");

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setNumProblems(2);
        updateRequest.setProblems(Collections.singletonList(problemDto));

        ApiError ERROR = ProblemError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsNullValue() throws Exception {
        UserDto host = TestFields.userDto1();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);

        room = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, RoomDto.class, HttpStatus.OK);

        // Difficulty remains unchanged from default
        assertEquals(ProblemDifficulty.RANDOM, room.getDifficulty());
        assertEquals(0, room.getProblems().size());
        assertEquals(GameTimer.DURATION_15, room.getDuration());
        assertEquals(1, room.getNumProblems());
    }

    @Test
    public void updateRoomSettingsNonExistentRoom() throws Exception {
        UserDto host = TestFields.userDto1();

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDifficulty(ProblemDifficulty.MEDIUM);

        ApiError ERROR = RoomError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.joinRoom("999999"), updateRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsInvalidPermissions() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(this.mockMvc, host, user);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(user);
        updateRequest.setDifficulty(ProblemDifficulty.HARD);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), updateRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsInvalidSettings() throws Exception {
        UserDto host = TestFields.userDto1();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        String jsonRequest = "{\"initiator\": {\"nickname\": \"host\"}, \"difficulty\": \"invalid\"}";

        ApiError ERROR = ProblemError.BAD_DIFFICULTY;

        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), jsonRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsDifferentCase() throws Exception {
        UserDto host = TestFields.userDto1();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        String jsonRequest = String.format("{\"initiator\": {\"nickname\": \"%s\",\"userId\":\"%s\"}, \"difficulty\": \"medIUM\"}", TestFields.NICKNAME, TestFields.USER_ID);

        room = MockHelper.putRequest(this.mockMvc, TestUrls.updateSettings(room.getRoomId()), jsonRequest, RoomDto.class, HttpStatus.OK);

        assertEquals(ProblemDifficulty.MEDIUM, room.getDifficulty());
    }

    @Test
    public void removeUserSuccessHostInitiator() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(this.mockMvc, host, user);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(host);
        request.setUserToDelete(user);

        room = MockHelper.deleteRequest(this.mockMvc, TestUrls.removeUser(room.getRoomId()), request, RoomDto.class, HttpStatus.OK);

        assertEquals(1, room.getUsers().size());
        assertFalse(room.getUsers().contains(user));
    }

    @Test
    public void removeUserSuccessSelfInitiator() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(this.mockMvc, host, user);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(user);
        request.setUserToDelete(user);

        room = MockHelper.deleteRequest(this.mockMvc, TestUrls.removeUser(room.getRoomId()), request, RoomDto.class, HttpStatus.OK);

        assertEquals(1, room.getUsers().size());
        assertFalse(room.getUsers().contains(user));
    }

    @Test
    public void removeNonExistentUser() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(host);
        request.setUserToDelete(user);

        ApiError ERROR = UserError.NOT_FOUND;

        ApiErrorResponse errorResponse = MockHelper.deleteRequest(this.mockMvc, TestUrls.removeUser(room.getRoomId()), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), errorResponse);
    }

    @Test
    public void removeUserBadHost() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();
        UserDto user2 = TestFields.userDto3();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(this.mockMvc, host, user);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(user2);
        request.setUserToDelete(user);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        ApiErrorResponse errorResponse = MockHelper.deleteRequest(this.mockMvc, TestUrls.removeUser(room.getRoomId()), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), errorResponse);
    }

    @Test
    public void deleteRoomSuccess() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(this.mockMvc, host, user);

        DeleteRoomRequest request = new DeleteRoomRequest();
        request.setHost(host);

        RoomDto returnedRoom = MockHelper.deleteRequest(this.mockMvc, TestUrls.deleteRoom(room.getRoomId()), request, RoomDto.class, HttpStatus.OK);
        assertEquals(room, returnedRoom);

        // The room should not exist any more.
        ApiError ERROR = RoomError.NOT_FOUND;
        ApiErrorResponse actual = MockHelper.getRequest(this.mockMvc, TestUrls.getRoom(room.getRoomId()), ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void deleteRoomBadHost() throws Exception {
        UserDto host = TestFields.userDto1();
        UserDto user = TestFields.userDto2();

        RoomDto room = RoomTestMethods.setUpRoomWithTwoUsers(this.mockMvc, host, user);

        DeleteRoomRequest request = new DeleteRoomRequest();
        request.setHost(user);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        ApiErrorResponse errorResponse = MockHelper.deleteRequest(this.mockMvc, TestUrls.deleteRoom(room.getRoomId()), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), errorResponse);
    }
}
