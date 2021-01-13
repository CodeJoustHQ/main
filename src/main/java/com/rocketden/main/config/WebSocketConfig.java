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

    public static final String USER_SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user";

    public static final String NOTIFICATION_SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-notification";

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
}
