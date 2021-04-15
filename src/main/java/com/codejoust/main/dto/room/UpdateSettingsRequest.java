package com.codejoust.main.dto.room;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.model.problem.ProblemDifficulty;

import com.codejoust.main.dto.problem.SelectableProblemDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateSettingsRequest {
    private UserDto initiator;
    private ProblemDifficulty difficulty;
    private Long duration;
    private Integer size;
    private Integer numProblems;
    private List<SelectableProblemDto> problems;
}
