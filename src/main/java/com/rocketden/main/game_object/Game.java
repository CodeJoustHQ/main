package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.model.Room;

@Getter
@Setter
public class Game {

    private Room room;

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private GameTimer gameTimer;

}
