package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Timer;

/**
 * The Timer class handles the timing for the Game.
 * This class is dynamic, so depending on player actions time could
 * be paused, added, or subtracted.
 */
@Getter
@Setter
public class GameTimer {

    // Varying durations of Game Timer, in seconds.
    public static final Long DURATION_10_SEC = (long) 10;
    public static final Long DURATION_30_SEC = (long) 30;
    public static final Long DURATION_1 = (long) 60;
    public static final Long DURATION_5 = (long) 300;
    public static final Long DURATION_15 = (long) 900;
    public static final Long DURATION_30 = (long) 1800;
    public static final Long DURATION_60 = (long) 3600;

    // The time that the game began.
    private LocalDateTime startTime = LocalDateTime.now();

    // The projected game duration, in seconds.
    private Long duration;

    private LocalDateTime endTime;

    private boolean timeUp = false;

    private Timer timer;

    /**
     * Instantiate the GameTimer class, and schedule the end game task after
     * timer ends.
     * 
     * @param duration The duration, in seconds, until the timer ends.
     */
    public GameTimer(Long duration) {
        this.duration = duration;
        this.endTime = this.startTime.plusSeconds(duration);
        this.timer = new Timer();
    }

}
