package com.rocketden.main.dto.game;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDto {
    private PlayerCodeDto playerCode;
    private List<SubmissionDto> submissions;
    private Boolean active;
}
