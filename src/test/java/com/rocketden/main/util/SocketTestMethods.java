package com.rocketden.main.util;

import com.rocketden.main.socket.WebSocketConnectionEvents;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.util.List;

import static java.util.concurrent.TimeUnit.SECONDS;

public class SocketTestMethods {

    public static StompSession connectToSocket(String endpoint, String userId, int port) throws Exception {
        WebSocketStompClient newStompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        newStompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompHeaders headers = new StompHeaders();
        headers.add(WebSocketConnectionEvents.USER_ID_KEY, userId);

        return newStompClient
                .connect(endpoint, new WebSocketHttpHeaders(), headers, new StompSessionHandlerAdapter() {}, port)
                .get(3, SECONDS);
    }
}
