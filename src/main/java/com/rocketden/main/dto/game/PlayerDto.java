package com.rocketden.main.dto.game;

import java.util.List;

import com.rocketden.main.dto.user.UserDto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class PlayerDto {
    private UserDto userDto;
    private PlayerCodeDto playerCode;
    private List<SubmissionDto> submissions;
    private Boolean solved;
}
