package com.rocketden.main.mapper;

import com.rocketden.main.dto.game.SubmissionMapper;
import com.rocketden.main.dto.game.TesterResult;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.game_object.SubmissionResult;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class SubmissionMapperTests {

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    @Test
    public void toSubmissionResult() {
        TesterResult testerResult = new TesterResult();
        testerResult.setConsole(null);
        testerResult.setUserOutput(OUTPUT);
        testerResult.setError(null);
        testerResult.setCorrectOutput(OUTPUT);
        testerResult.setCorrect(true);

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setHidden(false);
        testCaseDto.setInput(INPUT);

        SubmissionResult submissionResult = SubmissionMapper.toSubmissionResult(testerResult, testCaseDto);
        assertEquals(testerResult.getConsole(), submissionResult.getConsole());
        assertEquals(testerResult.getUserOutput(), submissionResult.getUserOutput());
        assertEquals(testerResult.getError(), submissionResult.getError());
        assertEquals(testerResult.getCorrectOutput(), submissionResult.getCorrectOutput());
        assertEquals(testerResult.isCorrect(), submissionResult.isCorrect());
        assertEquals(testCaseDto.isHidden(), submissionResult.isHidden());
        assertEquals(testCaseDto.getInput(), submissionResult.getInput());
    }
}
