package com.codejoust.main.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionResultDto {
    // This class is mapped with the tester service's ResultDto class.
    private String console;
    private String userOutput;
    private String error;
    private String input;
    private String correctOutput;
    private boolean hidden;
    private boolean correct;
}
