package com.rocketden.main.socket;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.room.RemoveUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.util.SocketTestMethods;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
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
import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class RoomSocketTests {

    @LocalServerPort
    private Integer port;

    @Autowired
    private TestRestTemplate template;

    @Mock
    private ProblemRepository problemRepository;

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
    public void setup() throws Exception {
        // Set up a room with a single user (the host)
        baseRestEndpoint = "http://localhost:" + port + "/api/v1/rooms";

        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // Create room first
        HttpEntity<CreateRoomRequest> createEntity = new HttpEntity<>(createRequest);
        RoomDto response = template.postForObject(baseRestEndpoint, createEntity, RoomDto.class);

        assertNotNull(response);
        room = response;

        // Next, set up the socket connection and subscription
        // BlockingQueue will hold the responses from the socket subscribe endpoint
        blockingQueue = new ArrayBlockingQueue<>(2);

        // Connect to the socket endpoint
        hostSession = SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, USER_ID, this.port);

        // Add socket messages to BlockingQueue so we can verify expected behavior
        hostSession.subscribe(String.format(SUBSCRIBE_ENDPOINT, response.getRoomId()), new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return RoomDto.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.add((RoomDto) payload);
            }
        });
    }

    /**
     * Helper method that sends a POST request using template to 
     * create a new problem
     * @return the created problem
     * @throws Exception if anything wrong occurs
     */
    private ProblemDto createSingleProblemAndTestCases() throws Exception {
        CreateProblemRequest createProblemRequest = new CreateProblemRequest();
        createProblemRequest.setName(NAME);
        createProblemRequest.setDescription(DESCRIPTION);
        createProblemRequest.setDifficulty(ProblemDifficulty.EASY);

        HttpEntity<CreateProblemRequest> createProblemEntity = new HttpEntity<>(createProblemRequest);
        String createProblemEndpoint = String.format("http://localhost:%s/api/v1/problems", port);

        ProblemDto problemActual = template.exchange(createProblemEndpoint, HttpMethod.POST, createProblemEntity, ProblemDto.class).getBody();

        assertEquals(NAME, problemActual.getName());
        assertEquals(DESCRIPTION, problemActual.getDescription());
        assertEquals(createProblemRequest.getDifficulty(), problemActual.getDifficulty());

        CreateTestCaseRequest createTestCaseRequest = new CreateTestCaseRequest();
        createTestCaseRequest.setInput(INPUT);
        createTestCaseRequest.setOutput(OUTPUT);

        HttpEntity<CreateTestCaseRequest> createTestCaseEntity = new HttpEntity<>(createTestCaseRequest);
        String createTestCaseEndpoint = String.format("http://localhost:%s/api/v1/problems/%s/test-case", port, problemActual.getProblemId());

        ProblemTestCaseDto testCaseActual = template.exchange(createTestCaseEndpoint, HttpMethod.POST, createTestCaseEntity, ProblemTestCaseDto.class).getBody();

        assertEquals(INPUT, testCaseActual.getInput());
        assertEquals(OUTPUT, testCaseActual.getOutput());
        assertFalse(testCaseActual.isHidden());

        return problemActual;
    }

    @Test
    public void socketReceivesMessageOnJoin() throws Exception {
        // Join the room, which should trigger a socket message to be sent
        UserDto newUser = new UserDto();
        newUser.setNickname(NICKNAME_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(newUser);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        RoomDto expected = template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Verify the socket message we received is as we'd expect
        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);
        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
    }

    @Test
    public void socketReceivesMessageOnHostChange() throws Exception {
        // A second user joins the room
        UserDto newUser = new UserDto();
        newUser.setNickname(NICKNAME_2);
        newUser.setUserId(USER_ID_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(newUser);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        RoomDto expected = template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Socket message is sent and is as expected
        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);
        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());

        // Connect the new user to the socket
        newUser = expected.getUsers().get(1);

        SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, newUser.getUserId(), this.port);
        blockingQueue.poll(5, SECONDS);

        // A host change request is sent
        UpdateHostRequest updateRequest = new UpdateHostRequest();
        updateRequest.setInitiator(expected.getHost());
        updateRequest.setNewHost(newUser);

        HttpEntity<UpdateHostRequest> updateEntity = new HttpEntity<>(updateRequest);
        String updateHostEndpoint = String.format("%s/%s/host", baseRestEndpoint, room.getRoomId());
        expected = template.exchange(updateHostEndpoint, HttpMethod.PUT, updateEntity, RoomDto.class).getBody();

        // Verify that the socket receives a message with the updated host
        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);
        assertEquals(newUser, expected.getHost());
        assertEquals(newUser, actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
    }

    @Test
    public void socketReceivesMessageOnSettingsChange() throws Exception {
        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(room.getHost());
        updateRequest.setDifficulty(ProblemDifficulty.HARD);

        HttpEntity<UpdateSettingsRequest> updateEntity = new HttpEntity<>(updateRequest);
        String updateSettingsEndpoint = String.format("%s/%s/settings", baseRestEndpoint, room.getRoomId());
        RoomDto actual = template.exchange(updateSettingsEndpoint, HttpMethod.PUT, updateEntity, RoomDto.class).getBody();

        assertNotNull(actual);
        assertEquals(updateRequest.getDifficulty(), actual.getDifficulty());

        // Verify that the socket receives a message with the updated settings
        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        assertEquals(updateRequest.getDifficulty(), actual.getDifficulty());
    }

    @Test
    public void socketReceivesMessageOnConnection() throws Exception {
        // Session ID has not been set yet
        assertNull(room.getHost().getSessionId());

        // Get the room to verify that the sessionId has been saved in the database
        String roomEndpoint = String.format("%s/%s", baseRestEndpoint, room.getRoomId());
        RoomDto actual = template.getForObject(roomEndpoint, RoomDto.class);

        assertNotNull(actual);
        assertNotNull(actual.getHost().getSessionId());

        // Have someone else join the room
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/users", roomEndpoint);
        template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Initially, the new user is not connected, so their sessionId should be null
        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);

        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());

        // The user then connects to the stomp client
        SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, user.getUserId(), this.port);

        // After connecting, the new user's sessionId should no longer be null
        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        assertNotNull(actual.getUsers().get(1).getSessionId());
    }

    @Test
    public void socketReceivesMessageOnDisconnection() throws Exception {
        // Have someone join the room
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Initially, the new user is not connected, so their sessionId should be null
        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());

        // The user then connects to the stomp client
        StompSession session = SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, user.getUserId(), this.port);

        // After connecting, the new user's sessionId should no longer be null
        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        assertNotNull(actual.getUsers().get(1).getSessionId());

        // When the user disconnects, the sessionId should be reset to null
        session.disconnect();

        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());
    }

    @Test
    public void socketChangesHostOnDisconnection() throws Exception {
        // Have someone join the room
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Initially, the new user is not connected, so their sessionId should be null
        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());

        // The user then connects to the stomp client
        StompSession session = SocketTestMethods.connectToSocket(CONNECT_ENDPOINT, user.getUserId(), this.port);

        /**
         * Have the new session subscribe to future messages in order to
         * receive blockingQueue message after the host disconnects.
         */
        session.subscribe(String.format(SUBSCRIBE_ENDPOINT, actual.getRoomId()), new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return RoomDto.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.add((RoomDto) payload);
            }
        });

        // After connecting, the new user's sessionId should no longer be null
        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        assertNotNull(actual.getUsers().get(1).getSessionId());

        /**
         * When the host disconnects, the sessionId should be reset to null
         * Change the host to the user
         */
        hostSession.disconnect();

        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);
        UserDto host = actual.getUsers().get(0);
        assertNull(host.getSessionId());

        // Ensure that the second connected user is the new host
        user = actual.getUsers().get(1);
        assertEquals(actual.getHost(), user);
    }

    @Test
    public void socketReceivesMessageOnStartGame() throws Exception {
        StartGameRequest startGameRequest = new StartGameRequest();
        startGameRequest.setInitiator(room.getHost());

        HttpEntity<StartGameRequest> startGameEntity = new HttpEntity<>(startGameRequest);
        String startGameEndpoint = String.format("%s/%s/start", baseRestEndpoint, room.getRoomId());

        // Create a problem that the game can find and attach to the room.
        createSingleProblemAndTestCases();

        RoomDto expected = template.exchange(startGameEndpoint, HttpMethod.POST, startGameEntity, RoomDto.class).getBody();

        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);

        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(true, actual.isActive());
    }

    @Test
    public void socketReceivesMessageOnUserKicked() throws Exception {
        UserDto newUser = new UserDto();
        newUser.setNickname(NICKNAME_2);
        newUser.setUserId(USER_ID_2);
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(newUser);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(actual);

        // Check that the room contains the user
        assertEquals(true, actual.getUsers().contains(newUser));

        RemoveUserRequest removeUserRequest = new RemoveUserRequest();
        removeUserRequest.setInitiator(room.getHost());
        removeUserRequest.setUserToDelete(newUser);

        HttpEntity<RemoveUserRequest> removeUserEntity = new HttpEntity<>(removeUserRequest);
        String removeUserEndpoint = String.format("%s/%s/users/remove", baseRestEndpoint, room.getRoomId());
        RoomDto expected = template.exchange(removeUserEndpoint, HttpMethod.PUT, removeUserEntity, RoomDto.class).getBody();

        actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);

        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(false, actual.getUsers().contains(newUser));
    }
}
