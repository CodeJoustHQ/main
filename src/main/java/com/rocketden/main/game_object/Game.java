package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rocketden.main.model.Room;
import com.rocketden.main.model.problem.Problem;

@Getter
@Setter
public class Game {

    private Room room;

    private List<Problem> problems = new ArrayList<>();

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private GameTimer gameTimer;

}
