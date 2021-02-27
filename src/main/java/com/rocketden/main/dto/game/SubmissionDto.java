package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.CodeLanguage;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class SubmissionDto {
    private CodeLanguage language;
    private String code;
    private List<SubmissionResultDto> results;
    private Integer numCorrect;
    private Integer numTestCases;
    private Double runtime;
    private String compilationError;
    private Instant startTime;
}
