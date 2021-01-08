package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.CodeLanguage;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class SubmissionDto {

    private CodeLanguage language;
    private String code;
    private Integer numCorrect;
    private Integer numTestCases;
}
