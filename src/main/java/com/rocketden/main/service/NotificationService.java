package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import org.springframework.stereotype.Service;

/**
 * Class to handle sending out notifications.
 */
@Service
public abstract class NotificationService extends GameManagementService {

    protected NotificationService(RoomRepository repository, SocketService socketService) {
        super(repository, socketService);
    }

}
