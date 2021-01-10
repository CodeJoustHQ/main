package com.rocketden.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.room.RoomDto;

@Getter
@Setter
@EqualsAndHashCode
public class GameDto {
    private List<ProblemDto> problems;
    private RoomDto room;
    private Map<String, PlayerDto> playerMap;
    private GameTimerDto gameTimer;
}
