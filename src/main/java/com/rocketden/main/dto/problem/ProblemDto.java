package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.ProblemDifficulty;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class ProblemDto {
    private String problemId;
    private String name;
    private String description;
    private ProblemDifficulty difficulty;
    private List<ProblemTestCaseDto> testCases = new ArrayList<>();
}
