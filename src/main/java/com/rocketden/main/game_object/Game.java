package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.model.Room;

@Getter
@Setter
public class Game {

    private Room room;

    // TODO discussion: is the key userId or nickname or none?
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
