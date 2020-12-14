package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

public class GameMapper {

    protected GameMapper() {}

    public static GameDto toDto(Game game) {
        if (game == null) {
            return null;
        }

        // TODO

        return null;
    }

    public static Game fromRoom(Room room) {
        if (room == null) {
            return null;
        }

        Game game = new Game();
        game.setRoom(room);

        for (User user : room.getUsers()) {
            Player player = playerFromUser(user);
            game.getPlayers().put(user.getNickname(), player);
        }

        return game;
    }

    public static Player playerFromUser(User user) {
        if (user == null) {
            return null;
        }

        Player player = new Player();
        player.setUser(user);

        return player;
    }
}
