package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Timer;

import com.rocketden.main.util.EndGameTimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The Timer class handles the timing for the Game.
 * This class is dynamic, so depending on player actions time could
 * be paused, added, or subtracted.
 */
@Getter
@Setter
public class GameTimer {

    Logger logger = LoggerFactory.getLogger(GameTimer.class);

    public GameTimer(Integer duration) {
        this.duration = duration;
        this.endTime = this.startTime.plusSeconds(duration);
        this.timer = new Timer();

        EndGameTimerTask timerTask = new EndGameTimerTask(this);
        logger.info("Task immediately prior.");
        timer.schedule(timerTask, duration);
        logger.info("Task immediately after.");
    }

    // The time that the game began.
    private LocalDateTime startTime = LocalDateTime.now();

    // The projected game duration, in seconds.
    private Integer duration;

    private LocalDateTime endTime;

    private boolean timeUp = false;

    private Timer timer;

}
