package com.codejoust.main.dto.game;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.model.report.CodeLanguage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionRequest {
    private CodeLanguage language;
    private String code;
    private String input;
    private UserDto initiator;
    private int problemIndex = 0;
}
