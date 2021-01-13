package com.rocketden.main.service;

import com.rocketden.main.config.WebSocketConfig;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameNotificationDto;
import com.rocketden.main.dto.room.RoomDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SocketService {

    private final SimpMessagingTemplate template;

    @Autowired
    public SocketService(SimpMessagingTemplate template) {
        this.template = template;
    }

    // Send updates about new users to the client through sockets
    public void sendSocketUpdate(RoomDto roomDto) {
        String socketPath = String.format(WebSocketConfig.USER_SOCKET_PATH, roomDto.getRoomId());
        template.convertAndSend(socketPath, roomDto);
    }

    // Send updates about new game status to the client through sockets
    public void sendSocketUpdate(GameDto gameDto) {
        String socketPath = String.format(WebSocketConfig.USER_SOCKET_PATH, gameDto.getRoom().getRoomId());
        template.convertAndSend(socketPath, gameDto);
    }

    // Send updates about new game status to the client through sockets
    public void sendSocketUpdate(String roomId, GameNotificationDto notificationDto) {
        String socketPath = String.format(WebSocketConfig.NOTIFICATION_SOCKET_PATH, roomId);
        template.convertAndSend(socketPath, notificationDto);
    }
    
}
