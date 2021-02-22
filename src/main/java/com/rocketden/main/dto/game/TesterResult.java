package com.rocketden.main.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TesterResult {
    private String console;
    private String userOutput;
    private String error;
    private String input;
    private String correctOutput;
    private boolean hidden;
    private boolean correct;
}
