package com.codejoust.main.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TesterResult {
    // This class is mapped directly to the tester service's ResultDto class.
    private String console;
    private String userOutput;
    private String error;
    private String correctOutput;
    private boolean correct;
}
