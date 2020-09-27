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
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        logger.info("Connected");
        logger.info(event.toString());
        GenericMessage gm = (GenericMessage) event.getMessage().getHeaders().get("simpConnectMessage");
        Map<String, LinkedList<String>> map = (Map) gm.getHeaders().get("nativeHeaders");
        logger.info(map.get("roomId").toString());
        logger.info(map.get("nickname").toString());
        logger.info(map.get("userId").toString());
    }

    // roomId: '581023',
    // nickname: 'Chris',
    // userId: '123052',

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        logger.info("Disconnected");
        logger.info(event.getMessage().getHeaders().get("roomId").toString());
        logger.info(event.getMessage().getHeaders().get("nickname").toString());
        logger.info(event.getMessage().getHeaders().get("userId").toString());
    }
}
