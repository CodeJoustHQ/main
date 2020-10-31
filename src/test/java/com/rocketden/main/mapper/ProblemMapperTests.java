package com.rocketden.main.mapper;

import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemTestCase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class ProblemMapperTests {

    private static final int ID = 10;
    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    @Test
    public void entityToDto() {
        Problem expected = new Problem();
        expected.setId(ID);
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        testCase.setHidden(true);
        expected.addTestCase(testCase);

        ProblemDto actual = ProblemMapper.toDto(expected);

        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getName(), actual.getName());
        assertEquals(expected.getDescription(), actual.getDescription());

        List<ProblemTestCaseDto> expectedTestCases = expected.getTestCases()
                .stream()
                .map(ProblemMapper::toTestCaseDto)
                .collect(Collectors.toList());

        assertEquals(expectedTestCases, actual.getTestCases());
    }

    @Test
    public void entityToTestCaseDto() {

        ProblemTestCase expected = new ProblemTestCase();
        expected.setInput(INPUT);
        expected.setOutput(OUTPUT);
        expected.setHidden(false);

        ProblemTestCaseDto actual = ProblemMapper.toTestCaseDto(expected);

        assertEquals(expected.getInput(), actual.getInput());
        assertEquals(expected.getOutput(), actual.getOutput());
        assertEquals(expected.getHidden(), actual.isHidden());
    }
}
