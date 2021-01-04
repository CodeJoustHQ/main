package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.Timer;

public class TimerMapper {

    protected TimerMapper() {}

    public static TimerDto toDto(Timer timer) {
        if (timer == null) {
            return null;
        }

        TimerDto timerDto = new TimerDto();
        timerDto.setDuration(timer.getDuration());
        timerDto.setStartTime(timer.getStartTime());
        timerDto.setEndTime(timer.getEndTime());

        return timerDto;
    }

}
