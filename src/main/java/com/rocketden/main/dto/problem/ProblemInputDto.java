package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.ProblemIOType;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class ProblemInputDto {
    private String name;
    private ProblemIOType type;
}
