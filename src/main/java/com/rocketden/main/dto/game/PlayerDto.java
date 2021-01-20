package com.rocketden.main.dto.game;

import java.util.List;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.util.Color;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class PlayerDto {
    private UserDto user;
    private String code;
    private String language;
    private List<SubmissionDto> submissions;
    private Boolean solved;
    private Color color;
}
