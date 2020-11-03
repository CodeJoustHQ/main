package com.rocketden.main.model;

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

    // The time that the game began.
    private LocalDateTime startTime = LocalDateTime.now();

    // 
    private Long duration;

    private LocalDateTime endTime;

    // Method that allows for dynamic changes to time.
    boolean isTimeUp() throws InterruptedException {
        while (!LocalDateTime.now().isAfter(endTime)) {
            Thread.sleep(1000);
        }
        return true;
    }

}
