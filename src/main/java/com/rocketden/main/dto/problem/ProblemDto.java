package com.rocketden.main.dto.problem;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProblemDto {
    private String name;
    private String description;
    private List<ProblemTestCaseDto> testCases = new ArrayList<>();
}
