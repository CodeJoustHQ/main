package com.rocketden.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

import com.rocketden.main.dto.room.RoomDto;

@Getter
@Setter
@EqualsAndHashCode
public class GameDto {
    private RoomDto roomDto;
    private Map<String, PlayerDto> playerMap;
    private GameTimerDto gameTimer;
}
