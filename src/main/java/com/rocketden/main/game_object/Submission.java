package com.rocketden.main.game_object;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class Submission {

    private PlayerCode playerCode;

    private List<SubmissionResult> results;

    // The time that the submission was received.
    private LocalDateTime startTime = LocalDateTime.now();

    private Integer numCorrect;

    private Integer numTestCases;

    private Double runtime;
    
    private String compilationError;
}
