package com.codejoust.main.dto.room;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.model.problem.ProblemDifficulty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSettingsRequest {
    private UserDto initiator;
    private ProblemDifficulty difficulty;
    private Long duration;
    private Integer size;
    private Integer numProblems;
}
