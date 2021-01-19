package com.rocketden.main.socket;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.util.SocketTestMethods;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

    private BlockingQueue<GameDto> blockingQueue;
    private String baseRestEndpoint;
    private RoomDto room;
    private StompSession hostSession;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "098765";
    private static final String CODE = "print('hi')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;
    private static final long DURATION = 5;

    @BeforeEach
    public void setup() throws Exception {
        baseRestEndpoint = "http://localhost:" + port + "/api/v1";

        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // Create room
        HttpEntity<CreateRoomRequest> createEntity = new HttpEntity<>(createRequest);
        String createEndpoint = String.format("%s/rooms", baseRestEndpoint);
        room = template.postForObject(createEndpoint, createEntity, RoomDto.class);
        assertNotNull(room);

        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        // Join room
        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/rooms/%s/users", baseRestEndpoint, room.getRoomId());
        room = template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();
        assertNotNull(room);

        // Update room settings
        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setDuration(DURATION);
        HttpEntity<UpdateSettingsRequest> updateEntity = new HttpEntity<>(updateRequest);
        String updateEndpoint = String.format("%s/rooms/%s/settings", baseRestEndpoint, room.getRoomId());
        room = template.exchange(updateEndpoint, HttpMethod.PUT, updateEntity, RoomDto.class).getBody();
        assertNotNull(room);

        // Create problems
        SocketTestMethods.createSingleProblemAndTestCases(template, port);

        // Start game
        StartGameRequest startRequest = new StartGameRequest();
        startRequest.setInitiator(host);
        HttpEntity<StartGameRequest> startEntity = new HttpEntity<>(startRequest);
        String startEndpoint = String.format("%s/rooms/%s/start", baseRestEndpoint, room.getRoomId());
        room = template.exchange(startEndpoint, HttpMethod.POST, startEntity, RoomDto.class).getBody();
        assertNotNull(room);

        // Set up the socket connection and subscription
        blockingQueue = new ArrayBlockingQueue<>(2);
        hostSession = SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID, this.port);

        hostSession.subscribe(String.format(SUBSCRIBE_ENDPOINT, room.getRoomId()), new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return GameDto.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.add((GameDto) payload);
            }
        });
    }

    @Test
    public void socketReceivesMessageOnGameOver() throws Exception {
        GameDto gameDto = blockingQueue.poll(DURATION + 5, SECONDS);

        assertNotNull(gameDto);
        assertNotNull(gameDto.getGameTimer());

        assertEquals(room, gameDto.getRoom());
        assertEquals(DURATION, gameDto.getGameTimer().getDuration());
        assertTrue(gameDto.getGameTimer().isTimeUp());
    }

    @Test
    public void socketReceivesMessageOnSubmit() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setInitiator(room.getHost());
        request.setCode(CODE);
        request.setLanguage(LANGUAGE);

        // Create room
        HttpEntity<SubmissionRequest> entity = new HttpEntity<>(request);
        String submitEndpoint = String.format("%s/games/%s/submission", baseRestEndpoint, room.getRoomId());
        SubmissionDto submissionDto = template.postForObject(submitEndpoint, entity, SubmissionDto.class);

        assertNotNull(submissionDto);
        assertEquals(CODE, submissionDto.getCode());
        assertEquals(LANGUAGE, submissionDto.getLanguage());

        GameDto gameDto = blockingQueue.poll(DURATION, SECONDS);

        assertNotNull(gameDto);
        assertEquals(room.getHost(), gameDto.getPlayers().get(0).getUser());
    }
}
