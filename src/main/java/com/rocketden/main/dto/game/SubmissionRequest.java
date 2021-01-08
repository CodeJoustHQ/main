package com.rocketden.main.dto.game;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.CodeLanguage;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionRequest {
    private CodeLanguage language;
    private String code;
    private UserDto initiator;
}
