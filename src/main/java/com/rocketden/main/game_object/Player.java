package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.rocketden.main.model.User;
import com.rocketden.main.util.Color;

@Getter
@Setter
public class Player {

    // User associated with this Player object.
    private User user;

    // Updated field to hold the user's current-language code.
    private PlayerCode playerCode;

    // Submissions in order of first-to-last submitted.
    private List<Submission> submissions = new ArrayList<>();

    /**
     * Solved variable if the user has successfully solved the problem,
     * or is still competing.
     */
    private Boolean solved = false;

    // Color associated with this player, generated on backend in game start.
    private Color color;

}
