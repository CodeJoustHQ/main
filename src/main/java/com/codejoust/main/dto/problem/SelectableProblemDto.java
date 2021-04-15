package com.codejoust.main.dto.problem;

import com.codejoust.main.model.problem.ProblemDifficulty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class SelectableProblemDto {
    private String problemId;
    private String name;
    private ProblemDifficulty difficulty;
}
