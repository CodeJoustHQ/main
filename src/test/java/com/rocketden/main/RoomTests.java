package com.rocketden.main;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RoomTests {

    @Autowired
    private MockMvc mockMvc;

    private static final String GET_ROOM = "/api/v1/rooms";
    private static final String POST_ROOM = "/api/v1/rooms";

    @Test
    public void joinExistingRoom() throws Exception {
        // GET request to join room should return successful response
    }

    @Test
    public void joinNonExistentRoom() throws Exception {
        // GET request to join non-existent room should fail
    }

    @Test
    public void createValidRoom() throws Exception {
        // POST request to create valid room should return successful response
    }

    @Test
    public void createAndJoinRoom() throws Exception {
        // POST request to create room and GET request to join room should succeed
    }

    @Test
    public void createMultipleRooms() throws Exception {
        // Multiple POST requests to create rooms should result in multiple open rooms
    }
}
