package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.ProblemDifficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemSettingsDto {

    private ProblemDifficulty difficulty;
}
