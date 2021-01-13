package com.rocketden.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode
public class GameTimerDto {
    private LocalDateTime startTime;
    private Long duration;
    private LocalDateTime endTime;
    private boolean timeUp;
}
