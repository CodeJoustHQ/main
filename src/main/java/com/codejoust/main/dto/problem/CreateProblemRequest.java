package com.codejoust.main.dto.problem;

import java.util.List;

import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProblemRequest {
    private String name;
    private String description;
    private ProblemDifficulty difficulty;
    private List<ProblemInputDto> problemInputs;
    private ProblemIOType outputType;
}
