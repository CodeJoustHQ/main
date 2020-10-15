package com.rocketden.main.api;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.model.ProblemDifficulty;
import com.rocketden.main.util.Utility;
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
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

    private static final String GET_ROOM = "/api/v1/rooms";
    private static final String PUT_ROOM = "/api/v1/rooms";
    private static final String POST_ROOM = "/api/v1/rooms";
    private static final String PUT_ROOM_HOST = "/api/v1/rooms/%s/host";
    private static final String PUT_ROOM_SETTINGS = "/api/v1/rooms/%s/settings";

    @Test
    public void getNonExistentRoom() throws Exception {
        ApiError ERROR = RoomError.NOT_FOUND;

        // Passing in nonexistent roomId should return 404
        MvcResult result = this.mockMvc.perform(get(GET_ROOM)
                .param("roomId", "012345"))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);

        // Passing in no roomId should result in same 404 error
        result = this.mockMvc.perform(get(GET_ROOM))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void joinNonExistentRoom() throws Exception {
        UserDto user = new UserDto();
        user.setNickname("rocket");

        // PUT request to join non-existent room should fail
        JoinRoomRequest request = new JoinRoomRequest();
        request.setRoomId("012345");
        request.setUser(user);

        ApiError ERROR = RoomError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndGetValidRoom() throws Exception {
        // POST request to create valid room should return successful response
        UserDto host = new UserDto();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        RoomDto expected = new RoomDto();
        expected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        expected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
        assertEquals(ProblemDifficulty.RANDOM, actual.getDifficulty());

        // Send GET request to validate that room exists
        String roomId = actual.getRoomId();
        expected.setRoomId(roomId);

        result = this.mockMvc.perform(get(GET_ROOM)
                .param("roomId", roomId))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actualGet = Utility.toObject(jsonResponse, RoomDto.class);

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

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinRoom() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = new UserDto();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto createActual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // Create User and List<User> for PUT request
        UserDto user = new UserDto();
        user.setNickname("rocket");
        users = new ArrayList<>();
        users.add(host);
        users.add(user);

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(roomId);
        joinRequest.setUser(user);

        RoomDto expected = new RoomDto();
        expected.setHost(host);
        expected.setUsers(users);
        expected.setRoomId(roomId);

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
    }

    @Test
    public void createAndJoinRoomUserAlreadyExists() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = new UserDto();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto createActual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(roomId);
        joinRequest.setUser(host);

        ApiError ERROR = RoomError.USER_ALREADY_PRESENT;

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndJoinRoomNoUser() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        UserDto host = new UserDto();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        RoomDto createExpected = new RoomDto();
        createExpected.setHost(host);
        List<UserDto> users = new ArrayList<>();
        users.add(host);
        createExpected.setUsers(users);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto createActual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(createExpected.getHost(), createActual.getHost());
        assertEquals(createExpected.getUsers(), createActual.getUsers());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(roomId);

        ApiError ERROR = UserError.INVALID_USER;

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void changeRoomHostSuccess() throws Exception {
        UserDto firstHost = new UserDto();
        firstHost.setNickname("FirstHost");

        UserDto secondHost = new UserDto();
        secondHost.setNickname("SecondHost");

        RoomDto room = setUpRoomWithTwoUsers(firstHost, secondHost);

        // Host sends request to change hosts
        UpdateHostRequest updateHostRequest = new UpdateHostRequest();
        updateHostRequest.setInitiator(firstHost);
        updateHostRequest.setNewHost(secondHost);

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_HOST, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateHostRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(secondHost, room.getHost());
        assertEquals(2, room.getUsers().size());

        // Confirm with a GET that the room has actually been updated in the database
        result = this.mockMvc.perform(get(GET_ROOM)
                .param("roomId", room.getRoomId()))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(room.getRoomId(), actual.getRoomId());
        assertEquals(room.getHost(), actual.getHost());
        assertEquals(room.getUsers(), actual.getUsers());
    }

    @Test
    public void changeRoomHostInvalidPermissions() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("Host");

        UserDto user = new UserDto();
        user.setNickname("User");

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        // Non-host tries to change hosts
        UpdateHostRequest updateHostRequest = new UpdateHostRequest();
        updateHostRequest.setInitiator(user);
        updateHostRequest.setNewHost(host);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_HOST, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateHostRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void changeRoomHostNonExistentRoom() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("Host");

        UserDto user = new UserDto();
        user.setNickname("User");

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        // Room does not exist
        UpdateHostRequest updateHostRequest = new UpdateHostRequest();
        updateHostRequest.setInitiator(host);
        updateHostRequest.setNewHost(user);

        ApiError ERROR = RoomError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_HOST, "999999"))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateHostRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);

    }

    @Test
    public void changeRoomHostNewHostNotFound() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("Host");

        UserDto user = new UserDto();
        user.setNickname("User");

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        // New host does not exist in the room
        UpdateHostRequest updateHostRequest = new UpdateHostRequest();
        updateHostRequest.setInitiator(host);
        updateHostRequest.setNewHost(new UserDto());

        ApiError ERROR = UserError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_HOST, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateHostRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("host");

        RoomDto room = setUpRoomWithOneUser(host);
        assertEquals(ProblemDifficulty.RANDOM, room.getDifficulty());

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDifficulty(ProblemDifficulty.EASY);

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(updateRequest.getDifficulty(), room.getDifficulty());

        // Confirm with a GET that the room has actually been updated in the database
        result = this.mockMvc.perform(get(GET_ROOM)
                .param("roomId", room.getRoomId()))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        RoomDto actual = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(updateRequest.getDifficulty(), actual.getDifficulty());
    }

    @Test
    public void updateRoomSettingsNullValue() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("host");

        RoomDto room = setUpRoomWithOneUser(host);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = Utility.toObject(jsonResponse, RoomDto.class);

        // Difficulty remains unchanged from default
        assertEquals(ProblemDifficulty.RANDOM, room.getDifficulty());
    }

    @Test
    public void updateRoomSettingsNonExistentRoom() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("host");

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDifficulty(ProblemDifficulty.MEDIUM);

        ApiError ERROR = RoomError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, "999999"))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsInvalidPermissions() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("host");
        UserDto user = new UserDto();
        user.setNickname("test");

        RoomDto room = setUpRoomWithTwoUsers(host, user);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(user);
        updateRequest.setDifficulty(ProblemDifficulty.HARD);

        ApiError ERROR = RoomError.INVALID_PERMISSIONS;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsInvalidSettings() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("host");

        RoomDto room = setUpRoomWithOneUser(host);

        String jsonRequest = "{\"initiator\": {\"nickname\": \"host\"}, \"difficulty\": \"invalid\"}";

        ApiError ERROR = RoomError.BAD_SETTING;

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonRequest))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateRoomSettingsDifferentCase() throws Exception {
        UserDto host = new UserDto();
        host.setNickname("host");

        RoomDto room = setUpRoomWithOneUser(host);

        String jsonRequest = "{\"initiator\": {\"nickname\": \"host\"}, \"difficulty\": \"medIUM\"}";

        MvcResult result = this.mockMvc.perform(put(String.format(PUT_ROOM_SETTINGS, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonRequest))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        room = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(ProblemDifficulty.MEDIUM, room.getDifficulty());
    }

    /**
     * Helper method that creates a room with the given host
     * @param host the host of the room
     * @return the resulting RoomDto object
     * @throws Exception any error that occurs
     */
    private RoomDto setUpRoomWithOneUser(UserDto host) throws Exception {
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return Utility.toObject(jsonResponse, RoomDto.class);
    }

    /**
     * Helper method that creates a room with two users
     * @param host the host of the room
     * @param user the second user who joins the room
     * @return the resulting RoomDto object
     * @throws Exception any error that occurs
     */
    private RoomDto setUpRoomWithTwoUsers(UserDto host, UserDto user) throws Exception {
        // First, create the room
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto room = Utility.toObject(jsonResponse, RoomDto.class);

        // A second user joins the room
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(room.getRoomId());
        joinRequest.setUser(user);

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        room = Utility.toObject(jsonResponse, RoomDto.class);

        assertEquals(host, room.getHost());
        assertEquals(2, room.getUsers().size());
        assertTrue(room.getUsers().contains(user));

        return room;
    }
}
