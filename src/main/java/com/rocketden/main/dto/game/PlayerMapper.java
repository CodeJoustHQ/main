package com.rocketden.main.dto.game;

import java.util.ArrayList;
import java.util.List;

import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.User;

import org.modelmapper.ModelMapper;

public class PlayerMapper {

    private static final ModelMapper mapper = new ModelMapper();

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

        List<SubmissionDto> submissions = new ArrayList<>();
        player.getSubmissions().forEach(submission -> submissions.add(mapper.map(submission, SubmissionDto.class)));
        playerDto.setSubmissions(submissions);

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
