package com.rocketden.main.dto.game;

import java.util.List;

import com.rocketden.main.dto.user.UserDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDto {
    private UserDto userDto;
    private String code;
    private String language;
    private List<SubmissionDto> submissions;
    private Boolean solved;
}
