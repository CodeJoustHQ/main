package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.GameTimer;

public class GameTimerMapper {

    protected GameTimerMapper() {}

    public static GameTimerDto toDto(GameTimer gameTimer) {
        if (gameTimer == null) {
            return null;
        }

        GameTimerDto gameTimerDto = new GameTimerDto();
        gameTimerDto.setDuration(gameTimerDto.getDuration());
        gameTimerDto.setStartTime(gameTimerDto.getStartTime());
        gameTimerDto.setEndTime(gameTimerDto.getEndTime());

        return gameTimerDto;
    }

}
