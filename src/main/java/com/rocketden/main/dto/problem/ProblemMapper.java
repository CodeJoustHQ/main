package com.rocketden.main.dto.problem;

import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemTestCase;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

public class ProblemMapper {

    protected ProblemMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static ProblemDto toDto(Problem entity) {
        if (entity == null) {
            return null;
        }

        return mapper.map(entity, ProblemDto.class);
    }

    public static Problem toEntity(ProblemDto dto) {
        if (dto == null) {
            return null;
        }

        // Matches strict variable names: https://stackoverflow.com/questions/49831753/modelmapper-matches-multiple-source-property-hierarchies.
        mapper.getConfiguration()
            .setMatchingStrategy(MatchingStrategies.STRICT);
        
        return mapper.map(dto, Problem.class);
    }

    public static ProblemTestCaseDto toTestCaseDto(ProblemTestCase entity) {
        if (entity == null) {
            return null;
        }

        return mapper.map(entity, ProblemTestCaseDto.class);
    }
}
