package com.rocketden.main.dto.game;

import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.game_object.SubmissionResult;

import org.modelmapper.ModelMapper;

public class TesterMapper {

    private static final ModelMapper mapper = new ModelMapper();

    protected TesterMapper() {}

    /**
     * This creates the SubmissionResult object from the TesterResult
     * returned from the Tester repository, and the corresponding test case.
     * 
     * @param testerResult The result for a test case from the Tester repo.
     * @param testCaseDto The relevant test case.
     * @return The SubmissionResult constructed with the provided information.
     */
    public static SubmissionResult toSubmissionResult(TesterResult testerResult, ProblemTestCaseDto testCaseDto) {
        if (testerResult == null || testCaseDto == null) {
            return null;
        }

        SubmissionResult submissionResult = mapper.map(testerResult, SubmissionResult.class);
        submissionResult.setHidden(testCaseDto.isHidden());
        submissionResult.setInput(testCaseDto.getInput());
        return submissionResult;
    }
}
