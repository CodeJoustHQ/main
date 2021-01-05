package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Timer;

import com.rocketden.main.util.EndGameTimerTask;

/**
 * The Timer class handles the timing for the Game.
 * This class is dynamic, so depending on player actions time could
 * be paused, added, or subtracted.
 */
@Getter
@Setter
public class GameTimer {

    // 15 minute duration for the GameTimer, in seconds.
    public static final Long DURATION_15 = (long) 900;

    /**
     * Instantiate the GameTimer class, and schedule the end game task after
     * timer ends.
     * 
     * @param duration The duration, in seconds, until the timer ends.
     * @param roomId The roomId needed to send the socket update on game end.
     */
    public GameTimer(Long duration, String roomId) {
        this.duration = duration;
        this.endTime = this.startTime.plusSeconds(duration);
        this.timer = new Timer();

        // Schedule the game to end after <duration> seconds.
        EndGameTimerTask timerTask = new EndGameTimerTask(this, roomId);
        timer.schedule(timerTask, duration * 1000);
    }

    // The time that the game began.
    private LocalDateTime startTime = LocalDateTime.now();

    // The projected game duration, in seconds.
    private Long duration;

    private LocalDateTime endTime;

    private boolean timeUp = false;

    private Timer timer;

}
