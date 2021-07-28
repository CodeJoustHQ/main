package com.codejoust.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.codejoust.main.model.Room;
import com.codejoust.main.model.problem.Problem;

@Getter
@Setter
public class Game {

    private Room room;

    private List<Problem> problems = new ArrayList<>();

    // Map from userId to associated player object
    private Map<String, Player> players = new HashMap<>();

    private GameTimer gameTimer;

    private Boolean playAgain = false;

    // Boolean to hold whether all users have solved the problem.
    private Boolean allSolved = false;

    // Boolean to hold whether the host ended the game early
    private Boolean gameEnded = false;

    // Boolean to hold whether the process of creating the game report started
    private Boolean createGameReportStarted = false;
}
