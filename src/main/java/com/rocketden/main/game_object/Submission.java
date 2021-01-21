package com.rocketden.main.game_object;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode
public class Submission {

    private PlayerCode playerCode;

    // The time that the submission was received.
    private LocalDateTime startTime = LocalDateTime.now();

    private Integer numCorrect;

    private Integer numTestCases;
}
