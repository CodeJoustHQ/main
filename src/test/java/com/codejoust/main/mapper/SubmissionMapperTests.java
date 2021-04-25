package com.codejoust.main.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.codejoust.main.dto.game.SubmissionMapper;
import com.codejoust.main.dto.game.TesterResult;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.game_object.SubmissionResult;

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
