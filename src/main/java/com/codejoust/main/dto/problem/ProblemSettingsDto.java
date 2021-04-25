package com.codejoust.main.dto.problem;

import com.codejoust.main.model.problem.ProblemDifficulty;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class ProblemSettingsDto {
    private ProblemDifficulty difficulty;
    private Integer numProblems;
}
