package com.rocketden.main.dto.game;

import com.rocketden.main.dto.user.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionRequest {
    // In the future, this should be changed to an enum class
    private String language;
    private String code;
    private UserDto initiator;
}
