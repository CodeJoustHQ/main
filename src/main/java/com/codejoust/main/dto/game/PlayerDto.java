package com.codejoust.main.dto.game;

import java.util.ArrayList;
import java.util.List;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.model.report.CodeLanguage;
import com.codejoust.main.util.Color;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PlayerDto {
    @EqualsAndHashCode.Include
    private UserDto user;
    private String code;
    private CodeLanguage language;
    private List<SubmissionDto> submissions = new ArrayList<>();
    private boolean[] solved;
    private Color color;
}
