package com.codejoust.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.room.RoomDto;

@Getter
@Setter
@EqualsAndHashCode
public class GameDto {
    private List<ProblemDto> problems;
    private RoomDto room;
    private GameTimerDto gameTimer;
    private List<PlayerDto> players = new ArrayList<>();
    private Boolean playAgain = false;
    private Boolean allSolved;
}
