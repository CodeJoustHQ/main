package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.rocketden.main.dto.room.RoomDto;

@Getter
@Setter
public class GameDto extends RoomDto {
    private List<PlayerDto> players;
    private TimerDto timer;
}
