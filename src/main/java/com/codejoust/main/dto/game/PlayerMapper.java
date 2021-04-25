package com.codejoust.main.dto.game;

import com.codejoust.main.game_object.Player;
import com.codejoust.main.model.User;


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
