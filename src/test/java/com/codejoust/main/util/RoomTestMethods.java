package com.codejoust.main.util;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.codejoust.main.dto.room.CreateRoomRequest;
import com.codejoust.main.dto.room.JoinRoomRequest;
import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.dto.user.UserDto;

public class RoomTestMethods {

    private static final String PUT_ROOM_JOIN = "/api/v1/rooms/%s/users";
    private static final String POST_ROOM_CREATE = "/api/v1/rooms";

    /**
     * Helper method that creates a room with the given host
     *
     * @param host the host of the room
     * @return the resulting RoomDto object
     * @throws Exception any error that occurs
     */
    public static RoomDto setUpRoomWithOneUser(MockMvc mockMvc, UserDto host) throws Exception {
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        MvcResult result = mockMvc.perform(post(POST_ROOM_CREATE)
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
    public static RoomDto setUpRoomWithTwoUsers(MockMvc mockMvc, UserDto host, UserDto user) throws Exception {
        // First, create the room
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        MvcResult result = mockMvc.perform(post(POST_ROOM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto room = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        // A second user joins the room
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        result = mockMvc.perform(put(String.format(PUT_ROOM_JOIN, room.getRoomId()))
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
}
