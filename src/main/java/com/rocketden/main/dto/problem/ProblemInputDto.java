package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.ProblemIOType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemInputDto {
    private String name;
    private ProblemIOType type;
}
