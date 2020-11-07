package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class Game extends Room {

    private Map<String, Player> players;

    private Timer timer;

    private void endGame() {
        try {
            if (timer.isTimeUp()) {
                // TODO: Send socket update to end the game, add results to db.
            }
        } catch(InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

}
