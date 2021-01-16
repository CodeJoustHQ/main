package com.rocketden.main.dto.problem;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTestCaseRequest {
    private String input;
    private String output;
    private boolean hidden = false;
    private String explanation;
}
