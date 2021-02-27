package com.rocketden.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@EqualsAndHashCode
public class GameTimerDto {
    private Instant startTime;
    private Instant endTime;
    private Long duration;
    private boolean timeUp;
}
