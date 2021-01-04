package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * The Timer class handles the timing for the Game.
 * This class is dynamic, so depending on player actions time could
 * be paused, added, or subtracted.
 */
@Getter
@Setter
public class Timer {

    public Timer(Integer duration) {
        this.duration = duration;
        this.endTime = this.startTime.plusSeconds(duration);
    }

    // The time that the game began.
    private LocalDateTime startTime = LocalDateTime.now();

    // The projected game duration, in seconds.
    private Integer duration;

    private LocalDateTime endTime;

    private boolean timeUp = false;

    // Method that allows for dynamic changes to time.
    boolean isTimeUp() throws InterruptedException {
        while (!LocalDateTime.now().isAfter(endTime)) {
            Thread.sleep(1000);
        }

        // Set timeUp to true, and return true.
        this.timeUp = true;
        return true;
    }

}
