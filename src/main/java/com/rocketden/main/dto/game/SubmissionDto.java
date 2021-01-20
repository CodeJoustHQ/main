package com.rocketden.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class SubmissionDto {
    private String language;
    private String code;
    private Integer numCorrect;
    private Integer numTestCases;
}
