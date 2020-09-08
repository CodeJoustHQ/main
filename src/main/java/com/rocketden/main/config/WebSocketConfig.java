package com.rocketden.main.config;

import com.rocketden.main.controller.v1.BaseRestController;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

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
}
