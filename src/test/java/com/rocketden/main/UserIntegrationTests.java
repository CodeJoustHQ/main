package com.rocketden.main;

import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserIntegrationTests {

    @LocalServerPort
    private int port;

    private SockJsClient sockJsClient;

    private WebSocketStompClient stompClient;

    private final WebSocketHttpHeaders headers = new WebSocketHttpHeaders();

    @BeforeEach
    public void setup() {
        // Create variables to model message transport, the SockJS client, and the STOMP client.
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        this.sockJsClient = new SockJsClient(transports);
        this.stompClient = new WebSocketStompClient(sockJsClient);
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    /**
     * This test creates a test STOMP session, connects the user to the 
     * socket endpoint, subscribes the user to the '.../subscribe-user' URL,
     * and then sends a message to '.../user', which will be formatted on 
     * the backend and subsequently sent to the '.../subscribe-user' URL.
     * 
     * This method then tests that the message sent to '.../user' is formatted
     * and passed on as expected to the '.../subscribe-user' URL (and thus, to
     * all users who are subscribed to this URL on this socket endpoint).
     */
    @Test
    public void addUser() throws Exception {

        // Latch allows threads to wait until remaining operations complete.
        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<Throwable> failure = new AtomicReference<>();

        // Test session handler for STOMP (created below).
        StompSessionHandler handler = new TestSessionHandler(failure) {

            @Override
            public void afterConnected(final StompSession session, StompHeaders connectedHeaders) {
                // After the socket is connected, subscribe and send message.
                session.subscribe(BaseRestController.BASE_SOCKET_URL + "/subscribe-user", new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders headers) {
                        return HashSet.class;
                    }

                    @Override
                    public void handleFrame(StompHeaders headers, Object payload) {
                        Set<User> users = (HashSet<User>) payload;
                        try {
                            // Verify that the subscription received the expected message.
                            assertEquals(1, users.size());
                        } catch (Throwable t) {
                            failure.set(t);
                        } finally {
                            session.disconnect();
                            latch.countDown();
                        }
                    }
                });
                try {
                    session.send(BaseRestController.BASE_SOCKET_URL + "/add-user", "Chris");
                } catch (Throwable t) {
                    failure.set(t);
                    latch.countDown();
                }
            }
        };

        // Connect to the socket with the STOMP client.
        this.stompClient.connect("ws://localhost:{port}" + BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint", this.headers, handler, this.port);

        if (latch.await(3, TimeUnit.SECONDS)) {
            if (failure.get() != null) {
                throw new AssertionError("", failure.get());
            }
        } else {
            fail("User response not received");
        }

    }

    @Test
    public void deleteUser() throws Exception {

        // Latch allows threads to wait until remaining operations complete.
        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<Throwable> failure = new AtomicReference<>();

        // Test session handler for STOMP (created below).
        StompSessionHandler handler = new TestSessionHandler(failure) {

            @Override
            public void afterConnected(final StompSession session, StompHeaders connectedHeaders) {
                // After the socket is connected, subscribe and send message.
                session.subscribe(BaseRestController.BASE_SOCKET_URL + "/subscribe-user", new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders headers) {
                        return HashSet.class;
                    }

                    @Override
                    public void handleFrame(StompHeaders headers, Object payload) {
                        Set<User> users = (HashSet<User>) payload;
                        try {
                            // Verify that the subscription received the expected message.
                            assertEquals(0, users.size());
                        } catch (Throwable t) {
                            failure.set(t);
                        } finally {
                            session.disconnect();
                            latch.countDown();
                        }
                    }
                });
                try {
                    session.send(BaseRestController.BASE_SOCKET_URL + "/delete-user", "Chris");
                } catch (Throwable t) {
                    failure.set(t);
                    latch.countDown();
                }
            }
        };

        // Connect to the socket with the STOMP client.
        this.stompClient.connect("ws://localhost:{port}" + BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint", this.headers, handler, this.port);

        if (latch.await(3, TimeUnit.SECONDS)) {
            if (failure.get() != null) {
                throw new AssertionError("", failure.get());
            }
        } else {
            fail("User response not received");
        }

    }

    // Create a custom STOMP session handler for testing.
    private class TestSessionHandler extends StompSessionHandlerAdapter {

        private final AtomicReference<Throwable> failure;

        public TestSessionHandler(AtomicReference<Throwable> failure) {
            this.failure = failure;
        }

        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            this.failure.set(new Exception(headers.toString()));
        }

        @Override
        public void handleException(StompSession s, StompCommand c, StompHeaders h, byte[] p, Throwable ex) {
            this.failure.set(ex);
        }

        @Override
        public void handleTransportError(StompSession session, Throwable ex) {
            this.failure.set(ex);
        }
    }
}
