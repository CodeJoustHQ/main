package com.rocketden.main.dto.game;

import java.util.List;

import com.rocketden.main.dto.user.UserDto;

import com.rocketden.main.game_object.CodeLanguage;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDto {
    private UserDto user;
    private String code;
    private CodeLanguage language;
    private List<SubmissionDto> submissions;
    private Boolean solved;
}
