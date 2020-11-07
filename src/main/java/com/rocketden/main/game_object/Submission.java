package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Submission {

    private Player player;

    private String code;

    // The time that the submission was received.
    private LocalDateTime startTime = LocalDateTime.now();

    /**
     * Fields to store the score result.
     * TODO: Eventually, there may exist a new Result object.
     */

    private Integer numCorrect;

    private Integer numTestCases;
}
