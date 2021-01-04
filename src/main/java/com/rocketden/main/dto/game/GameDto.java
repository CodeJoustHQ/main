package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.model.problem.Problem;

@Getter
@Setter
public class GameDto {
    private List<Problem> problems;
    private RoomDto roomDto;
    private Map<String, PlayerDto> playerMap;
    private TimerDto timer;
}
