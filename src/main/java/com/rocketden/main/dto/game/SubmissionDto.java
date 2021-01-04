package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionDto {

    private String language;
    private String code;
    private Integer numCorrect;
    private Integer numTestCases;
}
