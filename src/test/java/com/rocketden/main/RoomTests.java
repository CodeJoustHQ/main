package com.rocketden.main;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.GetRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.exception.RoomErrors;
import com.rocketden.main.exception.UserErrors;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.model.User;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashSet;
import java.util.Set;

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

    @Test
    public void getNonExistentRoom() throws Exception {
        ApiError ERROR = RoomErrors.ROOM_NOT_FOUND;

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
        User user = new User();
        user.setNickname("rocket");

        // PUT request to join non-existent room should fail
        JoinRoomRequest request = new JoinRoomRequest();
        request.setRoomId("012345");
        request.setUser(user);

        ApiError ERROR = RoomErrors.ROOM_NOT_FOUND;

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
        User host = new User();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);
        
        CreateRoomResponse expected = new CreateRoomResponse();
        expected.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateRoomResponse actual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

        assertEquals(expected.getHost(), actual.getHost());

        // Send GET request to validate that room exists

        String roomId = actual.getRoomId();

        GetRoomRequest request = new GetRoomRequest();
        request.setRoomId(roomId);

        GetRoomResponse expectedGet = new GetRoomResponse();
        expectedGet.setRoomId(roomId);

        result = this.mockMvc.perform(get(GET_ROOM)
                .param("roomId", roomId))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        GetRoomResponse actualGet = Utility.toObject(jsonResponse, GetRoomResponse.class);

        assertEquals(expectedGet.getRoomId(), actualGet.getRoomId());
    }

    @Test
    public void createValidRoomNoHost() throws Exception {
        // POST request to create valid room should return successful response
        CreateRoomRequest createRequest = new CreateRoomRequest();
        
        ApiError ERROR = RoomErrors.NO_HOST;

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
        User host = new User();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        CreateRoomResponse createExpected = new CreateRoomResponse();
        createExpected.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateRoomResponse createActual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

        assertEquals(createExpected.getHost(), createActual.getHost());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // Create User and Set<User> for PUT request
        User user = new User();
        user.setNickname("rocket");
        Set<User> users = new HashSet<>();
        users.add(host);
        users.add(user);

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(roomId);
        joinRequest.setUser(user);

        JoinRoomResponse expected = new JoinRoomResponse();
        expected.setUsers(users);
        expected.setRoomId(roomId);

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        JoinRoomResponse actual = Utility.toObject(jsonResponse, JoinRoomResponse.class);

        assertEquals(expected.getUsers(), actual.getUsers());
        assertEquals(expected.getRoomId(), actual.getRoomId());
    }

    @Test
    public void createAndJoinRoomUserAlreadyExists() throws Exception {
        // POST request to create room and PUT request to join room should succeed
        User host = new User();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        CreateRoomResponse createExpected = new CreateRoomResponse();
        createExpected.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateRoomResponse createActual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

        assertEquals(createExpected.getHost(), createActual.getHost());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(roomId);
        joinRequest.setUser(host);

        ApiError ERROR = RoomErrors.USER_ALREADY_PRESENT;

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
        User host = new User();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // 1. Send POST request and verify room was created
        CreateRoomResponse createExpected = new CreateRoomResponse();
        createExpected.setHost(host);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateRoomResponse createActual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

        assertEquals(createExpected.getHost(), createActual.getHost());

        // Get id of created room to join
        String roomId = createActual.getRoomId();

        // 2. Send PUT request and verify room was joined
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(roomId);

        ApiError ERROR = UserErrors.INVALID_USER;

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = Utility.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }
}
