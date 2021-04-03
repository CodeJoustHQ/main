package com.rocketden.main.dto.problem;

import java.util.List;

import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemIOType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProblemRequest {
    private String name;
    private String description;
    private Boolean approval;
    private ProblemDifficulty difficulty;
    private List<ProblemInputDto> problemInputs;
    private ProblemIOType outputType;
}
