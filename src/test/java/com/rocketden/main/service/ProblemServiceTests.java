package com.rocketden.main.service;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemSettingsDto;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class ProblemServiceTests {

    @Mock
    private ProblemRepository repository;

    @Spy
    @InjectMocks
    private ProblemService problemService;

    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    @Test
    public void getProblemSuccess() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.EASY);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        expected.addTestCase(testCase);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        ProblemDto response = problemService.getProblem(expected.getProblemId());

        assertEquals(expected.getProblemId(), response.getProblemId());
        assertEquals(expected.getName(), response.getName());
        assertEquals(expected.getDescription(), response.getDescription());
        assertEquals(expected.getDifficulty(), response.getDifficulty());

        assertEquals(expected.getTestCases().get(0).getInput(), response.getTestCases().get(0).getInput());
        assertEquals(expected.getTestCases().get(0).getOutput(), response.getTestCases().get(0).getOutput());
    }

    @Test
    public void getProblemNotFound() {
        ApiException exception = assertThrows(ApiException.class, () -> problemService.getProblem("ZZZ"));

        verify(repository).findProblemByProblemId("ZZZ");
        assertEquals(ProblemError.NOT_FOUND, exception.getError());
    }

    @Test
    public void createProblemSuccess() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemDto response = problemService.createProblem(request);

        verify(repository).save(Mockito.any(Problem.class));

        assertNotNull(response.getProblemId());
        assertEquals(NAME, response.getName());
        assertEquals(DESCRIPTION, response.getDescription());
        assertEquals(request.getDifficulty(), response.getDifficulty());
        assertEquals(0, response.getTestCases().size());
    }

    @Test
    public void createProblemFailureEmptyField() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(request));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void createProblemFailureBadDifficulty() {
        // Must provide a difficulty setting
        CreateProblemRequest missingRequest = new CreateProblemRequest();
        missingRequest.setName(NAME);
        missingRequest.setDescription(DESCRIPTION);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(missingRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());

        // Difficulty setting cannot be random
        CreateProblemRequest badRequest = new CreateProblemRequest();
        badRequest.setName(NAME);
        badRequest.setDescription(DESCRIPTION);
        badRequest.setDifficulty(ProblemDifficulty.RANDOM);

        exception = assertThrows(ApiException.class, () -> problemService.createProblem(badRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.BAD_SETTING, exception.getError());
    }

    @Test
    public void getProblemsSuccess() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.EASY);

        List<Problem> expected = new ArrayList<>();
        expected.add(problem);

        Mockito.doReturn(expected).when(repository).findAll();

        List<ProblemDto> response = problemService.getAllProblems();

        assertEquals(1, response.size());
        assertNotNull(response.get(0).getProblemId());
        assertEquals(NAME, response.get(0).getName());
        assertEquals(DESCRIPTION, response.get(0).getDescription());
        assertEquals(problem.getDifficulty(), response.get(0).getDifficulty());
    }

    @Test
    public void createTestCaseSuccess() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.HARD);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);
        request.setHidden(true);

        ProblemTestCaseDto response = problemService.createTestCase(expected.getProblemId(), request);

        verify(repository).save(Mockito.any(Problem.class));

        assertEquals(INPUT, response.getInput());
        assertEquals(OUTPUT, response.getOutput());
        assertTrue(response.isHidden());

        // The created test case should be added to this problem
        assertEquals(1, expected.getTestCases().size());
    }

    @Test
    public void createTestCaseFailure() {
        // A problem with the given ID could not be found
        CreateTestCaseRequest noProblemRequest = new CreateTestCaseRequest();
        noProblemRequest.setInput(INPUT);
        noProblemRequest.setOutput(OUTPUT);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createTestCase("Z", noProblemRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.NOT_FOUND, exception.getError());

        // The test case has empty fields
        CreateTestCaseRequest emptyFieldRequest = new CreateTestCaseRequest();
        emptyFieldRequest.setOutput(OUTPUT);
        emptyFieldRequest.setHidden(false);

        Problem problem = new Problem();
        String problemId = problem.getProblemId();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problemId);

        exception = assertThrows(ApiException.class, () -> problemService.createTestCase(problemId, emptyFieldRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void getRandomProblemMediumDifficulty() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);

        Mockito.doReturn(problems).when(repository).findAllByDifficulty(ProblemDifficulty.MEDIUM);

        ProblemSettingsDto request = new ProblemSettingsDto();
        request.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemDto response = problemService.getRandomProblem(request);

        assertEquals(problem1.getProblemId(), response.getProblemId());
    }

    @Test
    public void getRandomProblemRandomDifficulty() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);

        Mockito.doReturn(problems).when(repository).findAll();

        // Return correct problem when selecting random difficulty
        ProblemSettingsDto request = new ProblemSettingsDto();
        request.setDifficulty(ProblemDifficulty.RANDOM);

        ProblemDto response = problemService.getRandomProblem(request);
        assertEquals(problem1.getProblemId(), response.getProblemId());
    }

    @Test
    public void getRandomProblemNullDifficulty() {
        ProblemSettingsDto request = new ProblemSettingsDto();

        ApiException exception = assertThrows(ApiException.class, () -> problemService.getRandomProblem(request));

        assertEquals(ProblemError.BAD_SETTING, exception.getError());
    }

    @Test
    public void getRandomProblemNotFound() {
        ProblemSettingsDto request = new ProblemSettingsDto();
        request.setDifficulty(ProblemDifficulty.RANDOM);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.getRandomProblem(request));

        assertEquals(ProblemError.NOT_FOUND, exception.getError());
    }
}
