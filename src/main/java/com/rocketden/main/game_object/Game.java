package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.model.Room;
import com.rocketden.main.model.problem.Problem;

@Getter
@Setter
public class Game {

    private Room room;

    private Problem problem;

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private Timer timer = new Timer();

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
