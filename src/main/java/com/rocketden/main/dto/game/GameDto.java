package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.rocketden.main.dto.room.RoomDto;

@Getter
@Setter
public class GameDto {
    private RoomDto room;
    private List<PlayerDto> players = new ArrayList<>();
    private TimerDto timer;
}
