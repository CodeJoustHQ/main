package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.User;


public class PlayerMapper {

    protected PlayerMapper() {}

    public static Player playerFromUser(User user) {
        if (user == null) {
            return null;
        }

        Player player = new Player();
        player.setUser(user);

        return player;
    }
}
