package com.rocketden.main.dto.game;

import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.model.problem.Problem;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// This class is mapped directly to the tester service's RunRequest class.
public class TesterRequest {
    private String code;
    private CodeLanguage language;
    private Problem problem;
}
