package com.codejoust.main.dto.account;

import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemTagDto;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class AccountDto {
    private String uid;
    private List<ProblemDto> problems;
    private List<ProblemTagDto> problemTags;
}
