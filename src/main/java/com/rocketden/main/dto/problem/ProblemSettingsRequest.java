package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.ProblemDifficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemSettingsRequest {

    private ProblemDifficulty difficulty;
}
