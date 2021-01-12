package com.rocketden.main.dto.game;

import java.util.ArrayList;

import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.User;

public class PlayerMapper {

    protected PlayerMapper() {}

    public static PlayerDto toDto(Player player) {
        if (player == null) {
            return null;
        }

        PlayerDto playerDto = new PlayerDto();
        playerDto.setUser(UserMapper.toDto(player.getUser()));
        playerDto.setSolved(player.getSolved());
        playerDto.setCode(player.getPlayerCode().getCode());
        playerDto.setLanguage(player.getPlayerCode().getLanguage());
        playerDto.setSubmissions(new ArrayList<>());

        return playerDto;
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
