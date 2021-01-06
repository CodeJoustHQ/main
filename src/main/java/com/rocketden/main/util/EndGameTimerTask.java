package com.rocketden.main.util;

import java.util.TimerTask;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.service.SocketService;

public class EndGameTimerTask extends TimerTask {

    private Game game;

    private final SocketService socketService;

    public EndGameTimerTask(SocketService socketService, Game game) {
        this.socketService = socketService;
        this.game = game;
    }

	@Override
    public void run() {
        // Set time as up.
        game.getGameTimer().setTimeUp(true);

        // Get the Game DTO and send the relevant socket update.
        socketService.sendSocketUpdate(GameMapper.toDto(game));
    }
    
}
