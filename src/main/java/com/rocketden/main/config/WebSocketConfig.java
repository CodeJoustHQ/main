package com.rocketden.main.config;

import java.util.LinkedList;
import java.util.Map;

import com.rocketden.main.controller.v1.BaseRestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    private static final String CONNECT_MESSAGE = "simpConnectMessage";
    private static final String NATIVE_HEADERS = "nativeHeaders";

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Sets the base URL for message subscription and sending, respectively.
        config.enableSimpleBroker(BaseRestController.BASE_SOCKET_URL);
        config.setApplicationDestinationPrefixes(BaseRestController.BASE_SOCKET_URL);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This should be replaced with the actual room name.
        // See https://stackoverflow.com/questions/32843788/websocket-dynamically-add-and-remove-endpoints.
        registry.addEndpoint(BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint").withSockJS();
    }

    @EventListener
    public void onSocketConnected(SessionConnectedEvent event) {
        // Grab the custom headers on connection.
        GenericMessage genericMessage = (GenericMessage) event.getMessage().getHeaders().get(CONNECT_MESSAGE);
        Map<String, LinkedList<String>> customHeaderMap = (Map<String, LinkedList<String>>) genericMessage.getHeaders().get(NATIVE_HEADERS);

        // Retrieve the relevant variables
        String roomId = customHeaderMap.get("roomId").get(0);
        String nickname = customHeaderMap.get("nickname").get(0);
        String userId = customHeaderMap.get("userId").get(0);
        // unique ID from event

        // Add the user to the database.

    }

    // roomId: '581023',
    // nickname: 'Chris',
    // userId: '123052',

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        // Grab the custom headers on connection.
        GenericMessage genericMessage = (GenericMessage) event.getMessage().getHeaders().get(CONNECT_MESSAGE);
        Map<String, LinkedList<String>> customHeaderMap = (Map) genericMessage.getHeaders().get(NATIVE_HEADERS);

        // Retrieve the relevant variables.
        String roomId = customHeaderMap.get("roomId").get(0);
        String nickname = customHeaderMap.get("nickname").get(0);
        String userId = customHeaderMap.get("userId").get(0);

        // Remove the user from the database and send socket update.
    }
}
