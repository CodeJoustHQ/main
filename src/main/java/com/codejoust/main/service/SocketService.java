package com.codejoust.main.service;

import com.codejoust.main.config.WebSocketConfig;
import com.codejoust.main.dto.game.GameDto;
import com.codejoust.main.dto.game.GameNotificationDto;
import com.codejoust.main.dto.room.RoomDto;

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
        String socketPath = String.format(WebSocketConfig.SOCKET_LOBBY, roomDto.getRoomId());
        template.convertAndSend(socketPath, roomDto);
    }

    // Send updates about new game status to the client through sockets
    public void sendSocketUpdate(GameDto gameDto) {
        String socketPath = String.format(WebSocketConfig.SOCKET_GAME, gameDto.getRoom().getRoomId());
        template.convertAndSend(socketPath, gameDto);
    }

    // Send updates about new game status to the client through sockets
    public void sendSocketUpdate(String roomId, GameNotificationDto notificationDto) {
        String socketPath = String.format(WebSocketConfig.NOTIFICATION_SOCKET_PATH, roomId);
        template.convertAndSend(socketPath, notificationDto);
    }
    
}
