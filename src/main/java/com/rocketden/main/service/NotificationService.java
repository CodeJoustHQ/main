package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Class to handle sending out notifications.
 */
@Service
public class NotificationService {

    private final RoomRepository repository;
	private final SocketService socketService;

    @Autowired
    public NotificationService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }

}
