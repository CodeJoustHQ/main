package com.rocketden.main.service;

import java.util.List;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.notification.NotificationDto;
import com.rocketden.main.game_object.GameNotification;

import org.springframework.stereotype.Service;

/**
 * Class to handle sending out notifications.
 */
@Service
public class NotificationService {

    private final RoomRepository repository;
    private final SocketService socketService;

    protected NotificationService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }
    
    // Send a notification through a socket update.
    public NotificationDto sendNotification(GameNotification gameNotification, List<Player> players) {
        return new NotificationDto();
    }

}
