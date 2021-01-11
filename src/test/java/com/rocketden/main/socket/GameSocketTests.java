package com.rocketden.main.socket;


import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dto.room.RoomDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.BlockingQueue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class GameSocketTests {

    @LocalServerPort
    private Integer port;

    @Autowired
    private TestRestTemplate template;

    private static final String CONNECT_ENDPOINT = "ws://localhost:{port}" + BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint";
    private static final String SUBSCRIBE_ENDPOINT = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user";

    private BlockingQueue<RoomDto> blockingQueue;
    private String baseRestEndpoint;
    private RoomDto room;
    private StompSession hostSession;

    // Predefine problem attributes.
    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "098765";
    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    @BeforeEach
    public void setup() {
        // Create room/game with two users and set up socket connection/subscription
    }

    @Test
    public void socketReceivesMessageOnGameOver() {
        // TODO
    }
}
