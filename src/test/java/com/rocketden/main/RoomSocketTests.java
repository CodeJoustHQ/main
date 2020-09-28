package com.rocketden.main;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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

    @BeforeEach
    public void setup() {
        this.stompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    @Test
    public void socketReceivesMessageOnJoin() throws Exception {
        // Create POST and PUT requests to allow joining room and trigger socket
        String REST_ENDPOINTS = "http://localhost:" + port + "/api/v1/rooms";

        UserDto host = new UserDto();
        host.setNickname("host");
        CreateRoomRequest createRequest = new CreateRoomRequest();
        createRequest.setHost(host);

        // Create room first
        HttpEntity<CreateRoomRequest> createEntity = new HttpEntity<>(createRequest);
        RoomDto response = template.postForObject(REST_ENDPOINTS, createEntity, RoomDto.class);

        assertNotNull(response);

        // Next, set up the socket connection and subscription
        // BlockingQueue will hold the responses from the socket subscribe endpoint
        BlockingQueue<RoomDto> blockingQueue = new ArrayBlockingQueue<>(1);

        // Connect to the socket endpoint
        StompSession session = stompClient
                .connect(CONNECT_ENDPOINT, new WebSocketHttpHeaders(), new StompSessionHandlerAdapter() {}, this.port)
                .get(5, SECONDS);

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

        // Next, join the room, which should trigger a socket message to be sent
        UserDto newUser = new UserDto();
        newUser.setNickname("test");
        JoinRoomRequest joinRequest = new JoinRoomRequest();
        joinRequest.setRoomId(response.getRoomId());
        joinRequest.setUser(newUser);

        HttpEntity<JoinRoomRequest> joinEntity = new HttpEntity<>(joinRequest);
        RoomDto expected = template.exchange(REST_ENDPOINTS, HttpMethod.PUT, joinEntity, RoomDto.class).getBody();

        // Finally, verify the socket message we received is as we'd expect
        RoomDto actual = blockingQueue.poll(5, SECONDS);
        assertNotNull(expected);
        assertNotNull(actual);
        assertEquals(expected.getRoomId(), actual.getRoomId());
        assertEquals(expected.getHost(), actual.getHost());
        assertEquals(expected.getUsers(), actual.getUsers());
    }

}
