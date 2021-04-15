package com.codejoust.main.game_object;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionResult {
    private String console;

    private String userOutput;

    private String error;

    private String input;

    private String correctOutput;

    private boolean hidden;

    private boolean correct;
}
