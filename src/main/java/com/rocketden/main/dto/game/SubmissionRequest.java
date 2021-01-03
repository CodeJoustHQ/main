package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionRequest {
    // TODO: this should be changed to an enum class
    private String language;
    private String code;
}
