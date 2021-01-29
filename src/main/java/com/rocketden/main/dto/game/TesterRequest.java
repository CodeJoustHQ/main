package com.rocketden.main.dto.game;

import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.game_object.CodeLanguage;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// This class is mapped directly to the tester service's RunRequest class.
public class TesterRequest {
    private String code;
    private CodeLanguage language;
    private ProblemDto problem;
}
