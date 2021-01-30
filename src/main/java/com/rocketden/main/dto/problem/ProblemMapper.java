package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemInput;
import com.rocketden.main.model.problem.ProblemTestCase;

import org.modelmapper.ModelMapper;

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
}
