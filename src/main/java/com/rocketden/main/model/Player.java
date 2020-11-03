package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Player {

    // Player is identified by userId.
    private String userId;

    // Player corresponds to an associated user.
    private User user;

    // Updated field to hold the user's current-language code.
    private String code;

    // Submissions in order of first-to-last submitted.
    private List<Submission> submissions;

    // Active variable if the user is still competing.
    private Boolean active;

}
