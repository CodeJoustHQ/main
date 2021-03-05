package com.rocketden.main.socket;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameNotificationDto;
import com.rocketden.main.dto.game.PlayAgainRequest;
import com.rocketden.main.dto.game.PlayerDto;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.NotificationType;
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
import java.time.Instant;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
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
    private static final String NOTIFICATION_SUBSCRIBE_ENDPOINT = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-notification";
    private static final String GAME_SUBSCRIBE_ENDPOINT = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-game";

    private BlockingQueue<GameDto> userBlockingQueue;
    private BlockingQueue<GameNotificationDto> notificationBlockingQueue;
    private String baseRestEndpoint;
    private RoomDto room;
    private StompSession hostSession;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "098765";
    private static final String TIME_LEFT = "are ten seconds";
    private static final long DURATION = 15;
    private static final long TIME_UNTIL_TEN_LEFT = 5;
    private static final String CODE = "print('hi')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;

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

        // Set up the user socket connection and subscription
        userBlockingQueue = new ArrayBlockingQueue<>(2);
        hostSession = SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID, this.port);

        hostSession.subscribe(String.format(GAME_SUBSCRIBE_ENDPOINT, room.getRoomId()), new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return GameDto.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                userBlockingQueue.add((GameDto) payload);
            }
        });

        // Set up the notification socket subscription
        notificationBlockingQueue = new ArrayBlockingQueue<>(2);
        hostSession.subscribe(String.format(NOTIFICATION_SUBSCRIBE_ENDPOINT, room.getRoomId()), new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return GameNotificationDto.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                notificationBlockingQueue.add((GameNotificationDto) payload);
            }
        });
    }

    @Test
    public void socketReceivesMessageOnGameOver() throws Exception {
        GameDto gameDto = userBlockingQueue.poll(DURATION + 5, SECONDS);

        assertNotNull(gameDto);
        assertNotNull(gameDto.getGameTimer());

        assertEquals(room, gameDto.getRoom());
        assertEquals(DURATION, gameDto.getGameTimer().getDuration());
        assertTrue(gameDto.getGameTimer().isTimeUp());
    }

    @Test
    public void socketReceivesNotificationMessageTenSecondsLeft() throws Exception {
        GameNotificationDto notificationDto = notificationBlockingQueue.poll(TIME_UNTIL_TEN_LEFT + 5, SECONDS);

        assertNotNull(notificationDto);
        
        assertNull(notificationDto.getInitiator());
        assertEquals(NotificationType.TIME_LEFT,
            notificationDto.getNotificationType());
        assertTrue(Instant.now().isAfter(notificationDto.getTime())
            || Instant.now().minusSeconds((long) 1).isBefore(notificationDto.getTime()));
        assertEquals(TIME_LEFT, notificationDto.getContent());
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

        GameDto gameDto = userBlockingQueue.poll(DURATION, SECONDS);

        assertNotNull(gameDto);
        assertEquals(room.getHost(), gameDto.getPlayers().get(0).getUser());
    }

    @Test
    public void socketReceivesMessageOnPlayAgain() throws Exception {
        GameDto gameDto = userBlockingQueue.poll(DURATION + 5, SECONDS);
        assertNotNull(gameDto);

        PlayAgainRequest request = new PlayAgainRequest();
        request.setInitiator(room.getHost());

        HttpEntity<PlayAgainRequest> entity = new HttpEntity<>(request);
        String playAgainEndpoint = String.format("%s/games/%s/restart", baseRestEndpoint, room.getRoomId());
        RoomDto roomDto = template.postForObject(playAgainEndpoint, entity, RoomDto.class);
        assertNotNull(roomDto);

        gameDto = userBlockingQueue.poll(5, SECONDS);
        assertNotNull(gameDto);

        assertTrue(gameDto.getPlayAgain());
    }

    @Test
    public void socketReceivesMessageOnConnectDisconnect() throws Exception {
        UserDto user = room.getUsers().get(1);
        UserDto prevHost = room.getHost();
        assertNotEquals(prevHost, user);
        assertNull(user.getSessionId());

        // The second user connects to the stomp client
        StompSession session = SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, user.getUserId(), this.port);

        session.subscribe(String.format(GAME_SUBSCRIBE_ENDPOINT, room.getRoomId()), new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return GameDto.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                userBlockingQueue.add((GameDto) payload);
            }
        });

        // Message should be received on user connect
        GameDto gameDto = userBlockingQueue.poll(DURATION, SECONDS);
        assertNotNull(gameDto);

        user = gameDto.getRoom().getUsers().get(1);
        // Check sessionId for user is not null in both room and player list
        assertNotNull(user.getSessionId());
        for (PlayerDto player : gameDto.getPlayers()) {
            if (player.getUser().equals(user)) {
                assertNotNull(player.getUser().getSessionId());
            }
        }

        // The host then disconnects
        hostSession.disconnect();

        // After disconnecting, the host should be changed
        gameDto = userBlockingQueue.poll(DURATION, SECONDS);
        assertNotNull(gameDto);
        assertEquals(gameDto.getRoom().getHost(), user);

        for (PlayerDto player : gameDto.getPlayers()) {
            if (player.getUser().equals(prevHost)) {
                assertNull(player.getUser().getSessionId());
            }
        }
    }
}
