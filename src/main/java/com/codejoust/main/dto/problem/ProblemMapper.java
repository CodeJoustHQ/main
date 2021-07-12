package com.codejoust.main.dto.problem;

import com.codejoust.main.model.Account;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.problem.ProblemTag;
import com.codejoust.main.model.problem.ProblemTestCase;

import org.modelmapper.ModelMapper;

import java.util.UUID;

public class ProblemMapper {

    protected ProblemMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static ProblemDto toDto(Problem entity) {
        if (entity == null) {
            return null;
        }
        
        return mapper.map(entity, ProblemDto.class);
    }

    public static ProblemTestCaseDto toTestCaseDto(ProblemTestCase entity) {
        if (entity == null) {
            return null;
        }

        return mapper.map(entity, ProblemTestCaseDto.class);
    }

    public static ProblemInputDto toProblemInputDto(ProblemInput entity) {
        if (entity == null) {
            return null;
        }

        return mapper.map(entity, ProblemInputDto.class);
    }

    public static ProblemInput toProblemInputEntity(ProblemInputDto dto) {
        if (dto == null) {
            return null;
        }

        return mapper.map(dto, ProblemInput.class);
    }

    public static ProblemTagDto toProblemTagDto(ProblemTag entity) {
        if (entity == null) {
            return null;
        }
        
        return mapper.map(entity, ProblemTagDto.class);
    }

    public static Problem clone(Problem entity, Account account) {
        if (entity == null) {
            return null;
        }

        Problem clone = mapper.map(entity, Problem.class);

        // Set null to indicate new problem
        clone.setId(null);
        clone.setVerified(false);
        clone.setOwner(account);
        clone.setProblemId(UUID.randomUUID().toString()); // Re-generate unique UUID

        // Update test case and problem input IDs and problem reference correctly
        for (ProblemTestCase testCase : clone.getTestCases()) {
            testCase.setId(null);
            testCase.setProblem(clone);
        }
        for (ProblemInput problemInput : clone.getProblemInputs()) {
            problemInput.setId(null);
            problemInput.setProblem(clone);
        }

        // Remove tags, since tags are owner-specific
        while (!clone.getProblemTags().isEmpty()) {
            clone.removeProblemTag(clone.getProblemTags().get(0));
        }

        return clone;
    }
}
