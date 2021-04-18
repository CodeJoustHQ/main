package com.codejoust.main.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.stream.Collectors;

import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemInputDto;
import com.codejoust.main.dto.problem.ProblemMapper;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.problem.ProblemTestCase;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class ProblemMapperTests {

    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";
    private static final String EXPLANATION = "2 < 8, so those are swapped.";

    private static final String INPUT_NAME = "nums";

    @Test
    public void entityToDto() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.HARD);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        testCase.setExplanation(EXPLANATION);
        testCase.setHidden(true);
        expected.addTestCase(testCase);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, ProblemIOType.ARRAY_INTEGER);
        expected.addProblemInput(problemInput);
        expected.setOutputType(ProblemIOType.ARRAY_INTEGER);

        ProblemDto actual = ProblemMapper.toDto(expected);

        assertEquals(expected.getProblemId(), actual.getProblemId());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getDescription(), actual.getDescription());
        assertEquals(expected.getDifficulty(), actual.getDifficulty());

        List<ProblemTestCaseDto> expectedTestCases = expected.getTestCases()
                .stream()
                .map(ProblemMapper::toTestCaseDto)
                .collect(Collectors.toList());

        assertEquals(expectedTestCases, actual.getTestCases());

        List<ProblemInputDto> expectedProblemInputs = expected.getProblemInputs()
                .stream()
                .map(ProblemMapper::toProblemInputDto)
                .collect(Collectors.toList());

        assertEquals(expectedProblemInputs, actual.getProblemInputs());

        assertEquals(expected.getOutputType(), actual.getOutputType());
    }

    @Test
    public void entityToTestCaseDto() {
        ProblemTestCase expected = new ProblemTestCase();
        expected.setInput(INPUT);
        expected.setOutput(OUTPUT);
        expected.setHidden(false);
        expected.setExplanation(EXPLANATION);

        ProblemTestCaseDto actual = ProblemMapper.toTestCaseDto(expected);

        assertEquals(expected.getInput(), actual.getInput());
        assertEquals(expected.getOutput(), actual.getOutput());
        assertEquals(expected.getHidden(), actual.isHidden());
        assertEquals(expected.getExplanation(), actual.getExplanation());
    }

    @Test
    public void entityToProblemInputDto() {
        ProblemInput expected = new ProblemInput(INPUT, ProblemIOType.ARRAY_INTEGER);

        ProblemInputDto actual = ProblemMapper.toProblemInputDto(expected);

        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getType(), actual.getType());
    }
}
