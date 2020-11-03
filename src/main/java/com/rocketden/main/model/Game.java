package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Game {

    // Game is identified by roomId.
    private String roomId;

    // Game corresponds to an associated room.
    private Room room;

    private List<Player> players;

}
