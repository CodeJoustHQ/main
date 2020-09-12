package com.rocketden.main;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
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

    private static final String PUT_ROOM = "/api/v1/rooms";
    private static final String POST_ROOM = "/api/v1/rooms";

    @Test
    public void joinNonExistentRoom() throws Exception {
        User user = new User();
        user.setNickname("rocket");

        // PUT request to join non-existent room should fail
        JoinRoomRequest request = new JoinRoomRequest();
        request.setRoomId("012345");
        request.setUser(user);

        JoinRoomResponse expected = new JoinRoomResponse();
        expected.setMessage(JoinRoomResponse.ERROR_NOT_FOUND);

        MvcResult result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isNotFound())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        JoinRoomResponse actual = Utility.toObject(jsonResponse, JoinRoomResponse.class);

        assertEquals(expected.getMessage(), actual.getMessage());
    }

    @Test
    public void createValidRoom() throws Exception {
        // POST request to create valid room should return successful response
        User host = new User();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);
        
        CreateRoomResponse expected = new CreateRoomResponse();
        expected.setMessage(CreateRoomResponse.SUCCESS);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateRoomResponse actual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

        assertEquals(expected.getMessage(), actual.getMessage());
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
        createExpected.setMessage(CreateRoomResponse.SUCCESS);

        MvcResult result = this.mockMvc.perform(post(POST_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateRoomResponse createActual = Utility.toObject(jsonResponse, CreateRoomResponse.class);

        assertEquals(createExpected.getMessage(), createActual.getMessage());

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
        expected.setMessage(JoinRoomResponse.SUCCESS);
        expected.setUsers(users);
        expected.setRoomId(roomId);

        result = this.mockMvc.perform(put(PUT_ROOM)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(joinRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        JoinRoomResponse actual = Utility.toObject(jsonResponse, JoinRoomResponse.class);

        assertEquals(expected.getMessage(), actual.getMessage());
        assertEquals(expected.getUsers(), actual.getUsers());
        assertEquals(expected.getRoomId(), actual.getRoomId());
    }
}
