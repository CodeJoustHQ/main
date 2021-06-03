package com.codejoust.main.dto.account;

import com.codejoust.main.dto.problem.ProblemDto;
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
}
