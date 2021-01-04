package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TimerDto {
    private LocalDateTime startTime;
    private Integer duration;
    private LocalDateTime endTime;
    private boolean timeUp;
}
