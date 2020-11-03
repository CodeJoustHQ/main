package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Game {

    // Game is identified by roomId.
    private String roomId;

    // Game corresponds to an associated room.
    private Room room;

    private List<Player> players;

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
