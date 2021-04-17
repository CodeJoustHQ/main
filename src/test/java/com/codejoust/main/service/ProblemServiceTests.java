package com.codejoust.main.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.codejoust.main.dao.ProblemRepository;
import com.codejoust.main.dto.problem.CreateProblemRequest;
import com.codejoust.main.dto.problem.CreateTestCaseRequest;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemInputDto;
import com.codejoust.main.dto.problem.ProblemMapper;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.problem.ProblemTestCase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
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
    private static final String OUTPUT_2 = "8";
    private static final String EXPLANATION = "2 < 8, so those are swapped.";

    private static final String INPUT_NAME = "nums";
    private static final ProblemIOType IO_TYPE = ProblemIOType.ARRAY_INTEGER;
    private static final ProblemIOType IO_TYPE_2 = ProblemIOType.INTEGER;

    @Test
    public void getProblemSuccess() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.EASY);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        testCase.setExplanation(EXPLANATION);
        expected.addTestCase(testCase);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        ProblemDto response = problemService.getProblem(expected.getProblemId());

        assertEquals(expected.getProblemId(), response.getProblemId());
        assertEquals(expected.getName(), response.getName());
        assertEquals(expected.getDescription(), response.getDescription());
        assertEquals(expected.getDifficulty(), response.getDifficulty());

        assertEquals(expected.getTestCases().get(0).getInput(), response.getTestCases().get(0).getInput());
        assertEquals(expected.getTestCases().get(0).getOutput(), response.getTestCases().get(0).getOutput());
        assertEquals(expected.getTestCases().get(0).getExplanation(), response.getTestCases().get(0).getExplanation());
    }

    @Test
    public void getProblemNotFound() {
        ApiException exception = assertThrows(ApiException.class, () -> problemService.getProblem("ZZZ"));

        verify(repository).findProblemByProblemId("ZZZ");
        assertEquals(ProblemError.NOT_FOUND, exception.getError());
    }


    @Test
    public void getProblemEntitySuccess() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        Problem response = problemService.getProblemEntity(expected.getProblemId());
        assertEquals(expected, response);
    }

    @Test
    public void getProblemEntityNotFound() {
        Problem response = problemService.getProblemEntity("abc");
        assertNull(response);
    }

    @Test
    public void createProblemSuccess() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.MEDIUM);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        ProblemDto response = problemService.createProblem(request);

        verify(repository).save(Mockito.any(Problem.class));

        assertNotNull(response.getProblemId());
        assertEquals(NAME, response.getName());
        assertEquals(DESCRIPTION, response.getDescription());
        assertEquals(request.getDifficulty(), response.getDifficulty());
        assertEquals(0, response.getTestCases().size());
        assertEquals(problemInputs, response.getProblemInputs());
        assertEquals(IO_TYPE, response.getOutputType());
    }

    @Test
    public void createProblemFailureEmptyField() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(request));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "rocket rocket", "12", "$Hello", "jimmy=neutron"})
    public void createProblemInvalidIdentifier(String inputName) {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(inputName, IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(request));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.INVALID_VARIABLE_NAME, exception.getError());
    }

    @Test
    public void createProblemFailureBadDifficulty() {
        // Must provide a difficulty setting
        CreateProblemRequest missingRequest = new CreateProblemRequest();
        missingRequest.setName(NAME);
        missingRequest.setDescription(DESCRIPTION);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        missingRequest.setProblemInputs(problemInputs);
        missingRequest.setOutputType(IO_TYPE);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(missingRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());

        // Difficulty setting cannot be random
        CreateProblemRequest badRequest = new CreateProblemRequest();
        badRequest.setName(NAME);
        badRequest.setDescription(DESCRIPTION);
        badRequest.setDifficulty(ProblemDifficulty.RANDOM);
        badRequest.setProblemInputs(problemInputs);
        badRequest.setOutputType(IO_TYPE);

        exception = assertThrows(ApiException.class, () -> problemService.createProblem(badRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.BAD_DIFFICULTY, exception.getError());
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

        List<ProblemDto> response = problemService.getAllProblems(null);

        assertEquals(1, response.size());
        assertNotNull(response.get(0).getProblemId());
        assertEquals(NAME, response.get(0).getName());
        assertEquals(DESCRIPTION, response.get(0).getDescription());
        assertEquals(problem.getDifficulty(), response.get(0).getDifficulty());
    }

    @Test
    public void getAllProblemsOnlyApproved() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setApproval(true);

        List<Problem> expected = new ArrayList<>();
        expected.add(problem);
        Mockito.doReturn(expected).when(repository).findAllByApproval(true);

        List<ProblemDto> response = problemService.getAllProblems(true);

        assertEquals(1, response.size());
        assertEquals(NAME, response.get(0).getName());
        assertTrue(problem.getApproval());
    }

    @Test
    public void createTestCaseSuccess() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.HARD);
        expected.addProblemInput(new ProblemInput("name", ProblemIOType.ARRAY_INTEGER));
        expected.setOutputType(IO_TYPE);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);
        request.setHidden(true);
        request.setExplanation(EXPLANATION);

        ProblemTestCaseDto response = problemService.createTestCase(expected.getProblemId(), request);

        verify(repository).save(Mockito.any(Problem.class));

        assertEquals(INPUT, response.getInput());
        assertEquals(OUTPUT, response.getOutput());
        assertTrue(response.isHidden());
        assertEquals(EXPLANATION, response.getExplanation());

        // The created test case should be added to this problem
        assertEquals(1, expected.getTestCases().size());
    }

    @Test
    public void createTestCaseFailure() {
        // A problem with the given ID could not be found
        CreateTestCaseRequest noProblemRequest = new CreateTestCaseRequest();
        noProblemRequest.setInput(INPUT);
        noProblemRequest.setOutput(OUTPUT);

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.createTestCase("Z", noProblemRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.NOT_FOUND, exception.getError());

        // The test case has empty fields
        CreateTestCaseRequest emptyFieldRequest = new CreateTestCaseRequest();
        emptyFieldRequest.setOutput(OUTPUT);
        emptyFieldRequest.setHidden(false);

        Problem problem = new Problem();
        String problemId = problem.getProblemId();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problemId);

        exception = assertThrows(ApiException.class, () ->
                problemService.createTestCase(problemId, emptyFieldRequest));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void createTestCaseInvalidParsing() {
        Problem expected = new Problem();
        expected.setName(NAME);
        expected.setDescription(DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.HARD);
        expected.addProblemInput(new ProblemInput("name", IO_TYPE));
        expected.setOutputType(IO_TYPE_2);

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        String problemId = expected.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.createTestCase(problemId, request));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }

    @Test
    public void getRandomProblemMediumDifficulty() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);
        Mockito.doReturn(problems).when(repository).findAllByDifficultyAndApproval(ProblemDifficulty.MEDIUM, true);

        List<Problem> response = problemService.getProblemsFromDifficulty(ProblemDifficulty.MEDIUM, 1);

        assertEquals(problem1, response.get(0));
    }

    @Test
    public void getRandomProblemRandomDifficulty() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);
        Mockito.doReturn(problems).when(repository).findAllByApproval(true);

        // Return correct problem when selecting random difficulty
        List<Problem> response = problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, 1);
        assertEquals(problem1.getProblemId(), response.get(0).getProblemId());
    }

    @Test
    public void getRandomProblemExceedsAvailableProblems() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);
        Mockito.doReturn(problems).when(repository).findAllByApproval(true);

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, 3));

        assertEquals(ProblemError.NOT_ENOUGH_FOUND, exception.getError());
    }

    @Test
    public void getRandomProblemNullDifficulty() {
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(null, 1));

        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void getRandomProblemNullNumProblems() {
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, null));

        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void getRandomProblemZeroNumProblems() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        Collections.singletonList(problem1);

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, 0));

        assertEquals(ProblemError.INVALID_NUMBER_REQUEST, exception.getError());
    }

    @Test
    public void getRandomProblemNegativeNumProblems() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        Collections.singletonList(problem1);

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, -3));

        assertEquals(ProblemError.INVALID_NUMBER_REQUEST, exception.getError());
    }

    @Test
    public void getRandomProblemNotFound() {
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, 1));

        assertEquals(ProblemError.NOT_ENOUGH_FOUND, exception.getError());
    }

    @Test
    public void editProblemSuccess() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(IO_TYPE_2);

        ProblemTestCase originalTestCase = new ProblemTestCase();
        originalTestCase.setInput(INPUT);
        originalTestCase.setOutput(OUTPUT_2);
        problem.addTestCase(originalTestCase);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(INPUT);
        testCaseDto.setOutput(OUTPUT_2);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));

        problemService.editProblem(problem.getProblemId(), updatedProblem);

        verify(repository).save(problem);
        assertEquals(1, problem.getTestCases().size());
        assertEquals(1, problem.getProblemInputs().size());

        ProblemTestCase testCase = problem.getTestCases().get(0);
        assertEquals(testCaseDto.getInput(), testCase.getInput());
        assertEquals(testCaseDto.getOutput(), testCase.getOutput());
    }

    @ParameterizedTest
    @ValueSource(strings = {"class", "true", " ", "()", "\\"})
    public void editProblemInvalidIdentifier(String inputName) {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(IO_TYPE_2);

        ProblemTestCase originalTestCase = new ProblemTestCase();
        originalTestCase.setInput(INPUT);
        originalTestCase.setOutput(OUTPUT_2);
        problem.addTestCase(originalTestCase);

        String problemId = problem.getProblemId();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problemId);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.getProblemInputs().get(0).setName(inputName);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.editProblem(problemId, updatedProblem));
        
        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.INVALID_VARIABLE_NAME, exception.getError());
    }

    @Test
    public void editProblemBadTestCase() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(IO_TYPE);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput("[1, 2, 3");
        testCaseDto.setOutput(OUTPUT);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }

    @Test
    public void editProblemBadTestCaseOutput() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(IO_TYPE_2);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(INPUT);
        testCaseDto.setOutput(OUTPUT);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }
    @Test
    public void editProblemBadApproval() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOutputType(ProblemIOType.STRING);
        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setApproval(true);

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem));

        assertEquals(ProblemError.BAD_APPROVAL, exception.getError());
    }

    @Test
    public void editProblemEmptyFields() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(IO_TYPE);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(INPUT);
        testCaseDto.setOutput(OUTPUT);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));
        updatedProblem.setOutputType(null);

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem));

        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void editProblemNewProblemInputInvalidatesTestCases() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemInput problemInput = new ProblemInput(INPUT_NAME, IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(IO_TYPE);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        problem.addTestCase(testCase);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.getProblemInputs().get(0).setType(IO_TYPE_2);

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }

    @Test
    public void deleteProblemSuccess() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemDto response = problemService.deleteProblem(problem.getProblemId());

        verify(repository).delete(problem);

        assertEquals(problem.getName(), response.getName());
        assertEquals(problem.getDescription(), response.getDescription());
        assertEquals(problem.getDifficulty(), response.getDifficulty());
    }

    @Test
    public void deleteProblemFailure() {
        ApiException exception = assertThrows(ApiException.class, () -> problemService.deleteProblem("ZZZ"));

        verify(repository).findProblemByProblemId("ZZZ");
        assertEquals(ProblemError.NOT_FOUND, exception.getError());
    }

    @Test
    public void validateGsonParseable() {
        List<ProblemInputDto> inputs = new ArrayList<>();
        inputs.add(new ProblemInputDto("p1", ProblemIOType.BOOLEAN));
        inputs.add(new ProblemInputDto("p2", ProblemIOType.ARRAY_CHARACTER));
        inputs.add(new ProblemInputDto("p3", ProblemIOType.DOUBLE));

        problemService.validateInputsGsonParseable("true\n[c]\n0.5", inputs);
        problemService.validateInputsGsonParseable( " \n False \n [' '] \n 0.000 \n ", inputs);
        problemService.validateInputsGsonParseable("false\n[\"a\"]\n-5", inputs);

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable("true\n[c]\n", inputs));

        assertEquals(ProblemError.INCORRECT_INPUT_COUNT, exception.getError());

        exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable("true\n[abc]\n5.0", inputs));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());

        exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable("True\n'a'\n5.0", inputs));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());

        exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable("true\n[a]\nstring", inputs));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());

        exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable(null, inputs));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());

        exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable("true\n\n5.0", inputs));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());

        inputs.add(new ProblemInputDto("", ProblemIOType.ARRAY_STRING));
        exception = assertThrows(ApiException.class, () ->
                problemService.validateInputsGsonParseable("true\n[a]\n3.0\n[]", inputs));

        assertEquals(ProblemError.BAD_INPUT, exception.getError());
    }
}
