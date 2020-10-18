package com.rocketden.main.dto.problem;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProblemRequest {
    private String name;
    private String description;
}
