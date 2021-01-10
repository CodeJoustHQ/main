package com.rocketden.main.api;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.room.RemoveUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.util.UtilityTestMethods;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class RoomTests {

    @Autowired
    private MockMvc mockMvc;

    private static final String GET_ROOM = "/api/v1/rooms/%s";
    private static final String PUT_ROOM_JOIN = "/api/v1/rooms/%s/users";
    private static final String POST_ROOM_CREATE = "/api/v1/rooms";
    private static final String PUT_ROOM_HOST = "/api/v1/rooms/%s/host";
    private static final String PUT_ROOM_SETTINGS = "/api/v1/rooms/%s/settings";
    private static final String REMOVE_USER = "/api/v1/rooms/%s/users";

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID = "012345";
    private static final String USER_ID_2 = "678910";
    private static final String ROOM_ID = "012345";

    /**
     * Helper method that creates a room with the given host
     *
     * @param host the host of the room
     * @return the resulting RoomDto object
     * @throws Exception any error that occurs
     */
    private RoomDto setUpRoomWithOneUser(UserDto host) throws Exception {
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObject(jsonResponse, RoomDto.class);
    }

    /**
     * Helper method that creates a room with two users
     *
     * @param host the host of the room
     * @param user the second user who joins the room
     * @return the resulting RoomDto object
     * @throws Exception any error that occurs
     */
    private RoomDto setUpRoomWithTwoUsers(UserDto host, UserDto user) throws Exception {
        // First, create the room
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        // A second user joins the room
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        result = this.mockMvc.perform(put(String.format(PUT_ROOM_JOIN, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(host, room.getHost());
        assertEquals(2, room.getUsers().size());
        assertTrue(room.getUsers().contains(user));

        return room;
    }

    @Test
    public void getNonExistentRoom() throws Exception {
        ApiError ERROR = RoomError.NOT_FOUND;

        // Passing in nonexistent roomId should return 404
        MvcResult result = this.mockMvc.perform(get(String.format(GET_ROOM, ROOM_ID)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);

        // Passing in no roomId should result in same 404 error
        result = this.mockMvc.perform(get(String.format(GET_ROOM, " ")))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void joinNonExistentRoom() throws Exception {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME);

        // PUT request to join non-existent room should fail
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(user);

        ApiError ERROR = RoomError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_HOST, NICKNAME))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndGetValidRoom() throws Exception {
        // POST request to create valid room should return successful response
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        RoomDto expected = new RoomDto();
        expected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        expected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
        assertEquals(ProblemDifficulty.RANDOM, actual.getDifficulty());

        // Send GET request to validate that room exists
        String roomId = actual.getRoomId();
        expected.setRoomId(roomId);

        result = this.mockMvc.perform(get(String.format(GET_ROOM, roomId)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actualGet = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(expected.getRoomId(), actualGet.getRoomId());
        assertEquals(expected.getHost(), actualGet.getHost());
        assertEquals(expected.getUsers(), actualGet.getUsers());
        assertEquals(ProblemDifficulty.RANDOM, actual.getDifficulty());
    }

    @Test
    public void createValidRoomNoHost() throws Exception {
        // POST request to create valid room should return successful response
        CreateRoomRequest createRequest = new CreateRoomRequest();

        ApiError ERROR = RoomError.NO_HOST;

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinRoom() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto createActual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // Create User and List<User> for PUT request
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
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

        result = this.mockMvc.perform(put(String.format(PUT_ROOM_JOIN, roomId))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
    }

    @Test
    public void createAndJoinRoomUserAlreadyExists() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto createActual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(host);

        ApiError ERROR = RoomError.DUPLICATE_USERNAME;

        result = this.mockMvc.perform(put(String.format(PUT_ROOM_JOIN, roomId))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinRoomNoUser() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto createActual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();

        ApiError ERROR = UserError.INVALID_USER;

        result = this.mockMvc.perform(put(String.format(PUT_ROOM_JOIN, roomId))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto room = setUpRoomWithOneUser(host);
        assertEquals(ProblemDifficulty.RANDOM, room.getDifficulty());

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDifficulty(ProblemDifficulty.EASY);

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(updateRequest.getDifficulty(), room.getDifficulty());

        // Confirm with a GET that the room has actually been updated in the database
        result = this.mockMvc.perform(get(String.format(GET_ROOM, room.getRoomId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(updateRequest.getDifficulty(), actual.getDifficulty());
    }

    @Test
    public void updateRoomSettingsNullValue() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto room = setUpRoomWithOneUser(host);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        // Difficulty remains unchanged from default
        assertEquals(ProblemDifficulty.RANDOM, room.getDifficulty());
    }

    @Test
    public void updateRoomSettingsNonExistentRoom() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDifficulty(ProblemDifficulty.MEDIUM);

        ApiError ERROR = RoomError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, "999999"))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsInvalidPermissions() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(user);
        updateRequest.setDifficulty(ProblemDifficulty.HARD);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsInvalidSettings() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);

        RoomDto room = setUpRoomWithOneUser(host);

        String jsonRequest = "{\"initiator\": {\"nickname\": \"host\"}, \"difficulty\": \"invalid\"}";

        ApiError ERROR = ProblemError.BAD_DIFFICULTY;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonRequest))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsDifferentCase() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto room = setUpRoomWithOneUser(host);

        String jsonRequest = String.format("{\"initiator\": {\"nickname\": \"%s\",\"userId\":\"%s\"}, \"difficulty\": \"medIUM\"}", NICKNAME, USER_ID);

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonRequest))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(ProblemDifficulty.MEDIUM, room.getDifficulty());
    }

    @Test
    public void removeUserSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(host);
        request.setUserToDelete(user);

        MvcResult result = this.mockMvc.perform(delete(String.format(REMOVE_USER, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(1, room.getUsers().size());
        assertFalse(room.getUsers().contains(user));
    }

    @Test
    public void removeNonExistentUser() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        UserDto user = new UserDto();
        user.setUserId(USER_ID_2);

        RoomDto room = setUpRoomWithOneUser(host);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(host);
        request.setUserToDelete(user);

        ApiError ERROR = UserError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(delete(String.format(REMOVE_USER, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse errorResponse = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), errorResponse);
    }

    @Test
    public void removeUserBadHost() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(user);
        request.setUserToDelete(user);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        MvcResult result = this.mockMvc.perform(delete(String.format(REMOVE_USER, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse errorResponse = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), errorResponse);
    }
}
