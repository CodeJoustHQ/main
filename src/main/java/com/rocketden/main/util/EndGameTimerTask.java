package com.rocketden.main.util;

import java.util.TimerTask;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.service.GameManagementService;
import com.rocketden.main.service.SocketService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EndGameTimerTask extends TimerTask {

    private GameTimer gameTimer;

    private String roomId;

    @Autowired
    private GameManagementService gameManagementService;

    @Autowired
    private SocketService socketService;

    public EndGameTimerTask(GameTimer gameTimer, String roomId) {
        this.gameTimer = gameTimer;
        this.roomId = roomId;
    }

    @Override
    public void run() {
        // Set time as up and trigger a socket update.
        gameTimer.setTimeUp(true);

        // Get the Game DTO and send the relevant socket update.
        GameDto gameDto = gameManagementService.getGameDtoFromRoomId(roomId);
        socketService.sendSocketUpdate(gameDto);
    }
    
}
