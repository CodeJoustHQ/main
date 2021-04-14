package com.rocketden.main.dto.room;

import com.rocketden.main.dto.problem.SelectableProblemDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.problem.ProblemDifficulty;
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
