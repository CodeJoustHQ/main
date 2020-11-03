package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import org.springframework.stereotype.Service;

/**
 * Class to handle sending out notifications.
 */
@Service
public class NotificationService extends GameManagementService {

    public NotificationService(RoomRepository repository, SocketService socketService) {
        super(repository, socketService);
    }

}
