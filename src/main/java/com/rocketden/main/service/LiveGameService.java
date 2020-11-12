package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;

import org.springframework.stereotype.Service;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class LiveGameService {

    private final RoomRepository repository;
    private final SocketService socketService;

    protected LiveGameService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }

    // Update a specific player's code.
    public void updateCode(Player player, PlayerCode playerCode) {
        player.setPlayerCode(playerCode);
    }

}
