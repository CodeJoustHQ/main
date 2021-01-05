package com.rocketden.main.util;

import java.util.TimerTask;

import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.service.SocketService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class EndGameTimerTask extends TimerTask {

    Logger logger = LoggerFactory.getLogger(EndGameTimerTask.class);

    private GameTimer gameTimer;

    @Autowired
    private SocketService socketService;

    public EndGameTimerTask(GameTimer gameTimer) {
        this.gameTimer = gameTimer;
    }

    @Override
    public void run() {
        // Set time as up and trigger a socket update.
        gameTimer.setTimeUp(true);
        logger.info("The time is up.");
    }
    
}
