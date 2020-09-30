package com.rocketden.main.config;

import java.util.LinkedList;
import java.util.Map;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.model.User;

import org.springframework.beans.factory.annotation.Autowired;
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

    private final UserRepository repository;

    @Autowired
    public WebSocketConfig(UserRepository repository) {
        this.repository = repository;
    }

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
        registry.addEndpoint(BaseRestController.BASE_SOCKET_URL + "/join-room-endpoint").withSockJS();
    }

    @EventListener
    @SuppressWarnings("unchecked")
    public void onSocketConnected(SessionConnectedEvent event) {
        /**
         * Grab the custom headers on connection. Unchecked cast warnings are
         * suppressed: see method header.
         */
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        GenericMessage<byte[]> genericMessage = 
            (GenericMessage<byte[]>) event.getMessage().getHeaders().get(CONNECT_MESSAGE);
        Map<String, LinkedList<String>> customHeaderMap = 
            (Map<String, LinkedList<String>>) genericMessage.getHeaders().get(NATIVE_HEADERS);

        // Retrieve the ID of the user to update.
        Integer userId =
            Integer.parseInt(customHeaderMap.get("userId").get(0));

        // Get the unique auto-generated session ID for this connection.
        String sessionId = sha.getSessionId();

        // Update the session ID of the relevant user.
        User user = repository.findUserByUserId(userId);
        user.setSessionId(sessionId);
        user.setConnected(true);
    }

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        // Grab the custom headers on connection.
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        sha.getSessionId();
        String sessionId = sha.getSessionId();

        // Remove the user from the database and send socket update.
        User user = repository.findUserBySessionId(sessionId);
        user.setSessionId(null);
        user.setConnected(false);

        // Send socket update.
    }
}
