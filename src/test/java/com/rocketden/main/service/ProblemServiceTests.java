package com.rocketden.main.service;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Problem;
import com.rocketden.main.model.ProblemTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class ProblemServiceTests {

    @Mock
    private ProblemRepository repository;

    @Spy
    @InjectMocks
    private ProblemService problemService;

    private static final int ID = 10;
    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 2, 8]";
    private static final String OUTPUT = "8";

    @Test
    public void getProblemSuccess() {
        Problem expected = new Problem();
        expected.setId(ID);
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        // TODO: change to addTestCase/deleteTestCase format
        expected.setTestCases(Collections.singletonList(testCase));

        Mockito.doReturn(expected).when(repository).findById(ID);

        ProblemDto response = problemService.getProblem(ID);

        assertEquals(expected.getId(), response.getId());
        assertEquals(expected.getName(), response.getName());
        assertEquals(expected.getDescription(), response.getDescription());

        assertEquals(expected.getTestCases().get(0).getInput(), response.getTestCases().get(0).getInput());
        assertEquals(expected.getTestCases().get(0).getOutput(), response.getTestCases().get(0).getOutput());
    }

    @Test
    public void getProblemNotFound() {

        ApiException exception = assertThrows(ApiException.class, () -> problemService.getProblem(ID));

        verify(repository).findById(ID);
        assertEquals(ProblemError.NOT_FOUND, exception.getError());
    }

    @Test
    public void createProblemSuccess() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);

        ProblemDto response = problemService.createProblem(request);

        verify(repository).save(Mockito.any(Problem.class));

        assertEquals(NAME, response.getName());
        assertEquals(DESCRIPTION, response.getDescription());
        assertEquals(0, response.getTestCases().size());
    }

    @Test
    public void createProblemFailureEmptyField() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setDescription(DESCRIPTION);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(request));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void getProblemsSuccess() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);

        List<Problem> expected = new ArrayList<>();
        expected.add(problem);

        Mockito.doReturn(expected).when(repository).findAll();

        List<ProblemDto> response = problemService.getAllProblems();

        assertEquals(1, response.size());
        assertEquals(NAME, response.get(0).getName());
        assertEquals(DESCRIPTION, response.get(0).getDescription());
    }

    @Test
    public void createTestCaseSuccess() {
        // test problem is updated correctly too
    }

    @Test
    public void createTestCaseFailure() {

    }
}
