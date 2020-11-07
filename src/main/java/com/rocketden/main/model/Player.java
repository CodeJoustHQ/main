package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Player {

    // User associated with this Player object.
    private User user;

    // Updated field to hold the user's current-language code.
    private PlayerCode playerCode;

    // Submissions in order of first-to-last submitted.
    private List<Submission> submissions;

    /**
     * Solved variable if the user has successfully solved the problem,
     * or is still competing.
     */
    private Boolean solved;

}
