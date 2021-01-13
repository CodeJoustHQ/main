package com.rocketden.main.service;

import com.rocketden.main.dto.game.GameNotificationDto;

import org.springframework.stereotype.Service;

/**
 * Class to handle sending out notifications.
 */
@Service
public class NotificationService {

    private final SocketService socketService;

    protected NotificationService(SocketService socketService) {
        this.socketService = socketService;
    }
    
    // Send a notification through a socket update.
    public GameNotificationDto sendNotification(String roomId, GameNotificationDto notificationDto) {
        socketService.sendSocketUpdate(roomId, notificationDto);
        return notificationDto;
    }

}
