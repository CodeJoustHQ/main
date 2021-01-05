package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.GameTimer;

public class GameTimerMapper {

    protected GameTimerMapper() {}

    public static GameTimerDto toDto(GameTimer gameTimer) {
        if (gameTimer == null) {
            return null;
        }

        GameTimerDto gameTimerDto = new GameTimerDto();
        gameTimerDto.setDuration(gameTimer.getDuration());
        gameTimerDto.setStartTime(gameTimer.getStartTime());
        gameTimerDto.setEndTime(gameTimer.getEndTime());
        gameTimerDto.setTimeUp(gameTimer.isTimeUp());

        return gameTimerDto;
    }

}
