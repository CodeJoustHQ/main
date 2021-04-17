package com.codejoust.main.dto.problem;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class ProblemTestCaseDto {
    private String input;
    private String output;
    private boolean hidden;
    private String explanation;
}
