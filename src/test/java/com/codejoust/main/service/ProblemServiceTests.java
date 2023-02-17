package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
import com.codejoust.main.dao.ProblemContainerRepository;
import com.codejoust.main.exception.AccountError;
import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.util.TestFields;
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
import com.codejoust.main.dao.ProblemTagRepository;
import com.codejoust.main.dao.RoomRepository;
import com.codejoust.main.dto.problem.CreateProblemRequest;
import com.codejoust.main.dto.problem.CreateProblemTagRequest;
import com.codejoust.main.dto.problem.CreateTestCaseRequest;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemInputDto;
import com.codejoust.main.dto.problem.ProblemMapper;
import com.codejoust.main.dto.problem.ProblemTagDto;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemContainer;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.problem.ProblemTag;
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

    @Mock
    private ProblemTagRepository tagRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private ProblemContainerRepository problemContainerRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private FirebaseService firebaseService;

    @Spy
    @InjectMocks
    private ProblemService problemService;

    @Test
    public void getProblemSuccess() {
        Problem expected = new Problem();
        expected.setName(TestFields.NAME);
        expected.setDescription(TestFields.DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.EASY);
        expected.setOwner(TestFields.account1());

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(TestFields.INPUT);
        testCase.setOutput(TestFields.OUTPUT);
        testCase.setExplanation(TestFields.EXPLANATION);
        expected.addTestCase(testCase);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        ProblemDto response = problemService.getProblem(expected.getProblemId(), TestFields.TOKEN);

        assertEquals(expected.getProblemId(), response.getProblemId());
        assertEquals(expected.getName(), response.getName());
        assertEquals(expected.getDescription(), response.getDescription());
        assertEquals(expected.getDifficulty(), response.getDifficulty());

        assertEquals(expected.getTestCases().get(0).getInput(), response.getTestCases().get(0).getInput());
        assertEquals(expected.getTestCases().get(0).getOutput(), response.getTestCases().get(0).getOutput());
        assertEquals(expected.getTestCases().get(0).getExplanation(), response.getTestCases().get(0).getExplanation());
    }

    @Test
    public void getProblemNotVerifiedPermissionsFailure() {
        Problem problem = TestFields.problem1();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());
        Mockito.doThrow(new ApiException(AccountError.INVALID_CREDENTIALS)).when(firebaseService).verifyTokenMatchesUid(TestFields.TOKEN_2, problem.getOwner().getUid());

        ApiException exception = assertThrows(ApiException.class, () -> problemService.getProblem(problem.getProblemId(), TestFields.TOKEN_2));
        assertEquals(AccountError.INVALID_CREDENTIALS, exception.getError());
    }

    @Test
    public void getProblemVerifiedSuccess() {
        Problem problem = TestFields.problem1();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());
        Mockito.verify(firebaseService, Mockito.never()).verifyTokenMatchesUid(Mockito.any(), Mockito.any());

        ProblemDto response = problemService.getProblem(problem.getProblemId(), "fake");
        assertEquals(problem.getName(), response.getName());
    }

    @Test
    public void getProblemNotFound() {
        ApiException exception = assertThrows(ApiException.class, () -> problemService.getProblem("ZZZ", TestFields.TOKEN));

        verify(repository).findProblemByProblemId("ZZZ");
        assertEquals(ProblemError.NOT_FOUND, exception.getError());
    }


    @Test
    public void getProblemEntitySuccess() {
        Problem expected = new Problem();
        expected.setName(TestFields.NAME);
        expected.setDescription(TestFields.DESCRIPTION);

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
        CreateProblemRequest request = TestFields.createProblemRequest1();

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        ProblemDto response = problemService.createProblem(request, TestFields.TOKEN);

        verify(repository).save(Mockito.any(Problem.class));

        assertNotNull(response.getProblemId());
        assertEquals(TestFields.NAME, response.getName());
        assertEquals(TestFields.DESCRIPTION, response.getDescription());
        assertEquals(request.getDifficulty(), response.getDifficulty());
        assertEquals(0, response.getTestCases().size());
        assertEquals(request.getProblemInputs(), response.getProblemInputs());
        assertEquals(TestFields.IO_TYPE, response.getOutputType());
    }

    @Test
    public void createProblemFailureEmptyField() {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setDescription(TestFields.DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(TestFields.IO_TYPE);

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(request, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "rocket rocket", "12", "$Hello", "jimmy=neutron"})
    public void createProblemInvalidIdentifier(String inputName) {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(TestFields.NAME);
        request.setDescription(TestFields.DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(inputName, TestFields.IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(TestFields.IO_TYPE);

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(request, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.INVALID_VARIABLE_NAME, exception.getError());
    }

    @Test
    public void createProblemFailureBadDifficulty() {
        // Must provide a difficulty setting
        CreateProblemRequest missingRequest = new CreateProblemRequest();
        missingRequest.setName(TestFields.NAME);
        missingRequest.setDescription(TestFields.DESCRIPTION);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problemInputs.add(problemInput);
        missingRequest.setProblemInputs(problemInputs);
        missingRequest.setOutputType(TestFields.IO_TYPE);

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblem(missingRequest, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());

        // Difficulty setting cannot be random
        CreateProblemRequest badRequest = new CreateProblemRequest();
        badRequest.setName(TestFields.NAME);
        badRequest.setDescription(TestFields.DESCRIPTION);
        badRequest.setDifficulty(ProblemDifficulty.RANDOM);
        badRequest.setProblemInputs(problemInputs);
        badRequest.setOutputType(TestFields.IO_TYPE);

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        exception = assertThrows(ApiException.class, () -> problemService.createProblem(badRequest, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.BAD_DIFFICULTY, exception.getError());
    }

    @Test
    public void getAllProblemsAdminAccountSuccess() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.EASY);
        List<Problem> expected = new ArrayList<>();
        expected.add(problem);
        Mockito.doReturn(expected).when(repository).findAll();

        List<ProblemDto> response = problemService.getAllProblems(null, TestFields.TOKEN);

        assertEquals(1, response.size());
        assertNotNull(response.get(0).getProblemId());
        assertEquals(TestFields.NAME, response.get(0).getName());
        assertEquals(TestFields.DESCRIPTION, response.get(0).getDescription());
        assertEquals(problem.getDifficulty(), response.get(0).getDifficulty());
    }

    @Test
    public void getAllProblemsNoTokenFailure() {
        Mockito.doThrow(new ApiException(AccountError.INVALID_CREDENTIALS)).when(firebaseService).verifyAdminAccount(null);
        ApiException exception = assertThrows(ApiException.class, () -> problemService.getAllProblems(false, null));
        assertEquals(AccountError.INVALID_CREDENTIALS, exception.getError());
    }

    @Test
    public void getAllProblemsOnlyVerified() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setVerified(true);

        List<Problem> expected = new ArrayList<>();
        expected.add(problem);
        Mockito.doReturn(expected).when(repository).findAllByVerified(true);

        List<ProblemDto> response = problemService.getAllProblems(true, null);

        assertEquals(1, response.size());
        assertEquals(TestFields.NAME, response.get(0).getName());
        assertTrue(problem.getVerified());
    }

    @Test
    public void createTestCaseSuccess() {
        Problem expected = new Problem();
        expected.setName(TestFields.NAME);
        expected.setDescription(TestFields.DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.HARD);
        expected.addProblemInput(new ProblemInput("name", ProblemIOType.ARRAY_INTEGER));
        expected.setOutputType(TestFields.IO_TYPE);
        expected.setOwner(TestFields.account1());

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(TestFields.INPUT);
        request.setOutput(TestFields.OUTPUT);
        request.setHidden(true);
        request.setExplanation(TestFields.EXPLANATION);

        ProblemTestCaseDto response = problemService.createTestCase(expected.getProblemId(), request, TestFields.TOKEN);

        verify(repository).save(Mockito.any(Problem.class));

        assertEquals(TestFields.INPUT, response.getInput());
        assertEquals(TestFields.OUTPUT, response.getOutput());
        assertTrue(response.isHidden());
        assertEquals(TestFields.EXPLANATION, response.getExplanation());

        // The created test case should be added to this problem
        assertEquals(1, expected.getTestCases().size());
    }

    @Test
    public void createTestCaseFailure() {
        // A problem with the given ID could not be found
        CreateTestCaseRequest noProblemRequest = new CreateTestCaseRequest();
        noProblemRequest.setInput(TestFields.INPUT);
        noProblemRequest.setOutput(TestFields.OUTPUT);

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.createTestCase("Z", noProblemRequest, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.NOT_FOUND, exception.getError());

        // The test case has empty fields
        CreateTestCaseRequest emptyFieldRequest = new CreateTestCaseRequest();
        emptyFieldRequest.setOutput(TestFields.OUTPUT);
        emptyFieldRequest.setHidden(false);

        Problem problem = new Problem();
        problem.setOwner(TestFields.account1());
        String problemId = problem.getProblemId();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problemId);

        exception = assertThrows(ApiException.class, () ->
                problemService.createTestCase(problemId, emptyFieldRequest, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void createTestCaseInvalidParsing() {
        Problem expected = new Problem();
        expected.setName(TestFields.NAME);
        expected.setDescription(TestFields.DESCRIPTION);
        expected.setDifficulty(ProblemDifficulty.HARD);
        expected.addProblemInput(new ProblemInput("name", TestFields.IO_TYPE));
        expected.setOutputType(TestFields.IO_TYPE_2);
        expected.setOwner(TestFields.account1());

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(TestFields.INPUT);
        request.setOutput(TestFields.OUTPUT);

        Mockito.doReturn(expected).when(repository).findProblemByProblemId(expected.getProblemId());

        String problemId = expected.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.createTestCase(problemId, request, TestFields.TOKEN));

        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }

    @Test
    public void getRandomProblemMediumDifficulty() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);
        Mockito.doReturn(problems).when(repository).findAllByDifficultyAndVerified(ProblemDifficulty.MEDIUM, true);

        List<Problem> response = problemService.getProblemsFromDifficulty(ProblemDifficulty.MEDIUM, 1);

        assertEquals(problem1, response.get(0));
    }

    @Test
    public void getRandomProblemRandomDifficulty() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);
        Mockito.doReturn(problems).when(repository).findAllByVerified(true);

        // Return correct problem when selecting random difficulty
        List<Problem> response = problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, 1);
        assertEquals(problem1.getProblemId(), response.get(0).getProblemId());
    }

    @Test
    public void getRandomProblemExceedsAvailableProblems() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);
        List<Problem> problems = Collections.singletonList(problem1);
        Mockito.doReturn(problems).when(repository).findAllByVerified(true);

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

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.getProblemsFromDifficulty(ProblemDifficulty.RANDOM, 0));

        assertEquals(ProblemError.INVALID_NUMBER_REQUEST, exception.getError());
    }

    @Test
    public void getRandomProblemNegativeNumProblems() {
        Problem problem1 = new Problem();
        problem1.setDifficulty(ProblemDifficulty.MEDIUM);

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
        Problem problem = TestFields.problem1();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(TestFields.INPUT_3);
        testCaseDto.setOutput(TestFields.OUTPUT_3);

        ProblemTagDto problemTagDto = new ProblemTagDto();
        problemTagDto.setName(TestFields.TAG_NAME);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));
        updatedProblem.setProblemTags(Collections.singletonList(problemTagDto));

        problemService.editProblem(problem.getProblemId(), updatedProblem, TestFields.TOKEN);

        verify(repository).save(problem);
        assertEquals(1, problem.getTestCases().size());
        assertEquals(1, problem.getProblemTags().size());
        assertEquals(1, problem.getProblemInputs().size());

        ProblemTestCase testCase = problem.getTestCases().get(0);
        assertEquals(testCaseDto.getInput(), testCase.getInput());
        assertEquals(testCaseDto.getOutput(), testCase.getOutput());
    }

    @Test
    public void editProblemVerifiedFailure() {
        Problem problem = TestFields.problem2();
        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemDto request = ProblemMapper.toDto(problem);
        request.setVerified(true);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.editProblem(problem.getProblemId(), request, TestFields.TOKEN_2));
        assertEquals(AccountError.INVALID_CREDENTIALS, exception.getError());
    }

    @ParameterizedTest
    @ValueSource(strings = {"class", "true", " ", "()", "\\"})
    public void editProblemInvalidIdentifier(String inputName) {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOwner(TestFields.account1());

        ProblemInput problemInput = new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(TestFields.IO_TYPE_2);

        ProblemTestCase originalTestCase = new ProblemTestCase();
        originalTestCase.setInput(TestFields.INPUT_3);
        originalTestCase.setOutput(TestFields.OUTPUT_3);
        problem.addTestCase(originalTestCase);

        String problemId = problem.getProblemId();

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problemId);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.getProblemInputs().get(0).setName(inputName);

        ApiException exception = assertThrows(ApiException.class, () -> problemService.editProblem(problemId, updatedProblem, TestFields.TOKEN));
        
        verify(repository, never()).save(Mockito.any());
        assertEquals(ProblemError.INVALID_VARIABLE_NAME, exception.getError());
    }

    @Test
    public void editProblemBadTestCase() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOwner(TestFields.account1());

        ProblemInput problemInput = new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(TestFields.IO_TYPE);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput("[1, 2, 3");
        testCaseDto.setOutput(TestFields.OUTPUT);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem, TestFields.TOKEN));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }

    @Test
    public void editProblemBadTestCaseOutput() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOwner(TestFields.account1());

        ProblemInput problemInput = new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(TestFields.IO_TYPE_2);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(TestFields.INPUT);
        testCaseDto.setOutput(TestFields.OUTPUT);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem, TestFields.TOKEN));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }
    @Test
    public void editProblemBadVerified() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOutputType(ProblemIOType.STRING);
        ProblemInput problemInput = new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOwner(TestFields.account1());

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setVerified(true);

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem, TestFields.TOKEN));

        assertEquals(ProblemError.BAD_VERIFIED_STATUS, exception.getError());
    }

    @Test
    public void editProblemEmptyFields() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOwner(TestFields.account1());

        ProblemInput problemInput = new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(TestFields.IO_TYPE);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(TestFields.INPUT);
        testCaseDto.setOutput(TestFields.OUTPUT);

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.setTestCases(Collections.singletonList(testCaseDto));
        updatedProblem.setOutputType(null);

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem, TestFields.TOKEN));

        assertEquals(ProblemError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void editProblemNewProblemInputInvalidatesTestCases() {
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOwner(TestFields.account1());

        ProblemInput problemInput = new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE);
        problem.addProblemInput(problemInput);
        problem.setOutputType(TestFields.IO_TYPE);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(TestFields.INPUT);
        testCase.setOutput(TestFields.OUTPUT);
        problem.addTestCase(testCase);

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemDto updatedProblem = ProblemMapper.toDto(problem);
        updatedProblem.getProblemInputs().get(0).setType(TestFields.IO_TYPE_2);

        String problemId = problem.getProblemId();
        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problemId, updatedProblem, TestFields.TOKEN));

        assertEquals(ProblemError.INVALID_INPUT, exception.getError());
    }

    @Test
    public void deleteProblemSuccess() {
        /**
         * 1. Create the problem and mock the return of findProblemByProblemId.
         * 2. Create an associated ProblemContainer and mock its return.
         * 3. Create an associated Room and mock its return.
         * 4. Delete the problem and verify the calls and assertions.
         */
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);
        problem.setOwner(TestFields.account1());

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());

        ProblemContainer problemContainer = new ProblemContainer();
        problemContainer.setProblem(problem);
        problemContainer.setTestCaseCount(problem.getTestCases().size());
        Mockito.doReturn(Collections.singletonList(problemContainer)).when(problemContainerRepository).findAllByProblem(problem);
        problemContainer.setProblem(null);

        Room room = new Room();
        room.addProblem(problem);
        Mockito.doReturn(Collections.singletonList(room)).when(roomRepository).findByProblems_ProblemId(problem.getProblemId());
        room.removeProblem(problem);

        ProblemDto response = problemService.deleteProblem(problem.getProblemId(), TestFields.TOKEN);

        verify(repository).delete(problem);
        verify(problemContainerRepository).save(problemContainer);
        verify(roomRepository).save(room);

        assertEquals(problem.getName(), response.getName());
        assertEquals(problem.getDescription(), response.getDescription());
        assertEquals(problem.getDifficulty(), response.getDifficulty());
    }

    @Test
    public void deleteProblemFailure() {
        ApiException exception = assertThrows(ApiException.class, () -> problemService.deleteProblem("ZZZ", TestFields.TOKEN));

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

    @Test
    public void getProblemsWithTagSuccess() {
        /**
         * 1. Create a problem and problem tag.
         * 2. Add the problem to the problem tag, and vice versa.
         * 3. Mock repository return and verify that the correct problem
         * is returned with "getProblemsWithTag."
         */

        Problem problem = new Problem();
        problem.setName(TestFields.NAME);

        ProblemTag problemTag = new ProblemTag();
        problemTag.setName(TestFields.TAG_NAME);
        problemTag.setTagId(TestFields.TAG_ID);
        problem.addProblemTag(problemTag);

        Mockito.doReturn(Collections.singletonList(problem)).when(repository).findByProblemTags_TagId(problemTag.getTagId());
        
        List<ProblemDto> problems = problemService.getProblemsWithTag(problemTag.getTagId());

        assertEquals(1, problems.size());
        assertEquals(problem.getName(), problems.get(0).getName());
    }

    @Test
    public void getAllProblemTagsSuccess() {
        /**
         * 1. Create a problem tag.
         * 2. Mock repository return and verify that tag
         * is returned with "getAllProblemTags."
         */

        ProblemTag problemTag = TestFields.problemTag1();
        Mockito.doReturn(Collections.singletonList(problemTag)).when(tagRepository).findAllByOwner_Uid(problemTag.getOwner().getUid());
        Mockito.doReturn(problemTag.getOwner().getUid()).when(firebaseService).verifyToken(TestFields.TOKEN);

        List<ProblemTagDto> problemTags = problemService.getAllProblemTags(TestFields.TOKEN);

        assertEquals(1, problemTags.size());
        assertEquals(problemTag.getName(), problemTags.get(0).getName());
    }

    @Test
    public void createProblemTagSuccess() {
        // Create problem tag and verify save was called.
        CreateProblemTagRequest request = new CreateProblemTagRequest();
        request.setName(TestFields.TAG_NAME);

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        problemService.createProblemTag(request, TestFields.TOKEN);
        verify(tagRepository).save(Mockito.any(ProblemTag.class));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "longerthantwentycharactersistherule"})
    public void createProblemTagInvalidName(String tagName) {
        // Create problem tag and verify save was called.
        CreateProblemTagRequest request = new CreateProblemTagRequest();
        request.setName(tagName);

        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);
        ApiException exception = assertThrows(ApiException.class, () -> problemService.createProblemTag(request, TestFields.TOKEN));
        assertEquals(ProblemError.BAD_PROBLEM_TAG, exception.getError());
    }

    @Test
    public void deleteProblemTagSuccess() {
        /**
         * 1. Create a problem tag.
         * 2. Mock repository return to return problem tag.
         * 3. Delete problem tag and verify delete is called and method
         * returns properly.
         */

        ProblemTag problemTag = new ProblemTag();
        problemTag.setName(TestFields.TAG_NAME);
        problemTag.setTagId(TestFields.TAG_ID);
        problemTag.setOwner(TestFields.account1());

        Mockito.doReturn(problemTag).when(tagRepository).findTagByTagId(problemTag.getTagId());

        ProblemTagDto problemTagDto = problemService.deleteProblemTag(problemTag.getTagId(), TestFields.TOKEN);
        verify(tagRepository).delete(Mockito.any(ProblemTag.class));
        assertEquals(problemTag.getName(), problemTagDto.getName());
    }

    @Test
    public void deleteProblemTagFailure() {
        ProblemTag problemTag = TestFields.problemTag1();

        Mockito.doReturn(problemTag).when(tagRepository).findTagByTagId(problemTag.getTagId());
        Mockito.doThrow(new ApiException(AccountError.INVALID_CREDENTIALS)).when(firebaseService).verifyTokenMatchesUid(TestFields.TOKEN_2, TestFields.UID);
        ApiException exception = assertThrows(ApiException.class, () -> problemService.deleteProblemTag(problemTag.getTagId(), TestFields.TOKEN_2));
        assertEquals(AccountError.INVALID_CREDENTIALS, exception.getError());
    }

    @Test
    public void createProblemNotLoggedIn() {
        CreateProblemRequest request = TestFields.createProblemRequest1();

        ApiError ERROR = AccountError.INVALID_CREDENTIALS;
        Mockito.doThrow(new ApiException(ERROR)).when(firebaseService).verifyToken("bad-token");

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.createProblem(request, "bad-token"));

        assertEquals(AccountError.INVALID_CREDENTIALS, exception.getError());
    }

    @Test
    public void editProblemNotAuthorized() {
        Problem problem = TestFields.problem1();
        ProblemDto problemDto = ProblemMapper.toDto(problem);

        ApiError ERROR = AccountError.INVALID_CREDENTIALS;

        Mockito.doReturn(problem).when(repository).findProblemByProblemId(problem.getProblemId());
        Mockito.doThrow(new ApiException(ERROR)).when(firebaseService).verifyTokenMatchesUid("random", problem.getOwner().getUid());

        ApiException exception = assertThrows(ApiException.class, () ->
                problemService.editProblem(problem.getProblemId(), problemDto, "random"));

        assertEquals(AccountError.INVALID_CREDENTIALS, exception.getError());
    }
}
