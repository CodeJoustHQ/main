package com.rocketden.main.socket;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.ProblemDifficulty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class RoomSocketTests {

    @LocalServerPort
    private Integer port;

    private WebSocketStompClient stompClient;

    @Autowired
    private TestRestTemplate template;

    private static final String CONNECT_ENDPOINT = "ws://localhost:{port}" + BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint";
    private static final String SUBSCRIBE_ENDPOINT = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user";

    private BlockingQueue<RoomDto> blockingQueue;
    private String baseRestEndpoint;
    private RoomDto room;

    @BeforeEach
    public void setup() throws Exception {
        this.stompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        // Set up a room with a single user (the host)
        baseRestEndpoint = "http://localhost:" + port + "/api/v1/rooms";

        UserDto host = new UserDto();
        host.setNickname("host");
        host.setUserId("012345");
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

        StompHeaders headers = new StompHeaders();
        headers.add("userId", host.getUserId());

        // Connect to the socket endpoint
        StompSession session = stompClient
                .connect(CONNECT_ENDPOINT, new WebSocketHttpHeaders(), headers, new StompSessionHandlerAdapter() {}, this.port)
                .get(3, SECONDS);

        // Add socket messages to BlockingQueue so we can verify expected behavior
        session.subscribe(String.format(SUBSCRIBE_ENDPOINT, response.getRoomId()), new StompFrameHandler() {
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

    @Test
    public void socketReceivesMessageOnJoin() throws Exception {
        // Join the room, which should trigger a socket message to be sent
        UserDto newUser = new UserDto();
        newUser.setNickname("test");
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(newUser);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        RoomDto expected = template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Verify the socket message we received is as we'd expect
        RoomDto actual = blockingQueue.poll(3, SECONDS);
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
        newUser.setNickname("test");
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(newUser);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        RoomDto expected = template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Socket message is sent and is as expected
        RoomDto actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);
        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());

        // Update newUser with the created userId and updated information.
        newUser = expected.getUsers().get(1);

        // A host change request is sent
        UpdateHostRequest updateRequest = new UpdateHostRequest();
        updateRequest.setInitiator(expected.getHost());
        updateRequest.setNewHost(newUser);

        HttpEntity<UpdateHostRequest> updateEntity = new HttpEntity<>(updateRequest);
        String updateHostEndpoint = String.format("%s/%s/host", baseRestEndpoint, room.getRoomId());
        expected = template.exchange(updateHostEndpoint, HttpMethod.PUT, updateEntity, RoomDto.class).getBody();

        // Verify that the socket receives a message with the updated host
        actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);
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
        actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(actual);
        assertEquals(updateRequest.getDifficulty(), actual.getDifficulty());
    }

    @Test
    public void socketRecievesMessageOnConnection() throws Exception {
        // Session ID has not been set yet
        assertNull(room.getHost().getSessionId());

        // Get the room to verify that the sessionId has been saved in the database
        String roomEndpoint = String.format("%s/%s", baseRestEndpoint, room.getRoomId());
        RoomDto actual = template.getForObject(roomEndpoint, RoomDto.class);

        assertNotNull(actual);
        assertNotNull(actual.getHost().getSessionId());

        // Have someone else join the room
        UserDto user = new UserDto();
        user.setNickname("test");
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/users", roomEndpoint);
        template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Initially, the new user is not connected, so their sessionId should be null
        actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(actual);

        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());

        // The user then connects to the stomp client
        WebSocketStompClient newStompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        newStompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompHeaders headers = new StompHeaders();
        headers.add("userId", user.getUserId());

        newStompClient.connect(CONNECT_ENDPOINT, new WebSocketHttpHeaders(), headers, new StompSessionHandlerAdapter() {}, this.port)
                .get(3, SECONDS);

        // After connecting, the new user's sessionId should no longer be null
        actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(actual);
        assertNotNull(actual.getUsers().get(1).getSessionId());
    }

    @Test
    public void socketRecievesMessageOnDisconnection() throws Exception {
        // Have someone join the room
        UserDto user = new UserDto();
        user.setNickname("test");
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setUser(user);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        String joinRoomEndpoint = String.format("%s/%s/users", baseRestEndpoint, room.getRoomId());
        template.exchange(joinRoomEndpoint, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Initially, the new user is not connected, so their sessionId should be null
        RoomDto actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(actual);
        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());

        // The user then connects to the stomp client
        WebSocketStompClient newStompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        newStompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompHeaders headers = new StompHeaders();
        headers.add("userId", user.getUserId());

        StompSession session = newStompClient
                .connect(CONNECT_ENDPOINT, new WebSocketHttpHeaders(), headers, new StompSessionHandlerAdapter() {}, this.port)
                .get(3, SECONDS);

        // After connecting, the new user's sessionId should no longer be null
        actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(actual);
        assertNotNull(actual.getUsers().get(1).getSessionId());

        // When the user disconnects, the sessionId should be reset to null
        session.disconnect();

        actual = blockingQueue.poll(3, SECONDS);
        assertNotNull(actual);
        user = actual.getUsers().get(1);
        assertNull(user.getSessionId());
    }
}
