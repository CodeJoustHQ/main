package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.List;
import java.util.Map;

import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.room.RoomDto;

@Getter
@Setter
public class GameDto {
    private List<ProblemDto> problems;
    private RoomDto room;
    private List<PlayerDto> players = new ArrayList<>();
    private TimerDto timer;
}
