package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Player extends User {

    // Updated field to hold the user's current-language code.
    private PlayerCode playerCode;

    // Submissions in order of first-to-last submitted.
    private List<Submission> submissions;

    // Active variable if the user is still competing.
    private Boolean active;

}
