package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.Game;
import com.rocketden.main.model.Room;

public class GameMapper {

    protected GameMapper() {}

    public static Game fromRoom(Room room) {
        if (room == null) {
            return null;
        }

        Game game = new Game();
        game.setRoom(room);
        // TODO

        return game;
    }
}
