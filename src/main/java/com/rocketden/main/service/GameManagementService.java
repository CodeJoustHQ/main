package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameManagementService {

    private final RoomRepository repository;
	private final SocketService socketService;

    @Autowired
    public GameService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }
}
