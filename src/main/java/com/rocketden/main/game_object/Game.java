package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.service.SocketService;

import org.springframework.beans.factory.annotation.Autowired;

@Getter
@Setter
public class Game {

    // 15 second duration for the Timer.
    private static final Integer DURATION_15 = 15;

    private final SocketService socketService;

    @Autowired
    public Game(SocketService socketService) {
        this.socketService = socketService;
    }

    private Room room;

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private Timer timer = new Timer(DURATION_15);

    private void endGame() {
        try {
            if (timer.isTimeUp()) {
                socketService.sendSocketUpdate(GameMapper.toDto(this));
            }
        } catch(InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

}
