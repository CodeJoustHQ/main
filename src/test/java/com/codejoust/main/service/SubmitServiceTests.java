package com.codejoust.main.service;

import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.codejoust.main.dto.game.GameMapper;
import com.codejoust.main.dto.game.SubmissionDto;
import com.codejoust.main.dto.game.SubmissionRequest;
import com.codejoust.main.dto.game.SubmissionResultDto;
import com.codejoust.main.dto.game.TesterRequest;
import com.codejoust.main.dto.game.TesterResponse;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.exception.GameError;
import com.codejoust.main.exception.TesterError;
import com.codejoust.main.exception.api.ApiErrorResponse;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.Game;
import com.codejoust.main.game_object.Submission;
import com.codejoust.main.game_object.SubmissionResult;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemTestCase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class SubmitServiceTests {

    @Spy
    @InjectMocks
    private SubmitService submitService;

    @Captor
    ArgumentCaptor<TesterRequest> captor;

    @Test
    public void runCodeSuccess() {
        Room room = new Room();
        room.setRoomId(TestFields.ROOM_ID);
        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);

        List<Problem> problems = new ArrayList<>();
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setProblemId(TestFields.PROBLEM_ID);
        problem.setDifficulty(ProblemDifficulty.EASY);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(TestFields.INPUT);
        testCase.setOutput(TestFields.OUTPUT);
        problem.addTestCase(testCase);
        problems.add(problem);
        game.setProblems(problems);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setCode(TestFields.PYTHON_CODE);
        request.setInput(TestFields.INPUT);
        request.setInitiator(UserMapper.toDto(user));

        SubmissionDto submissionDto = submitService.runCode(game, request);

        verify(submitService).getSubmission(captor.capture());
        TesterRequest testerRequest = captor.getValue();

        // Verify TesterRequest has non-required fields set to null
        assertNull(testerRequest.getProblem().getProblemId());
        assertNull(testerRequest.getProblem().getName());
        assertNull(testerRequest.getProblem().getDescription());
        assertNull(testerRequest.getProblem().getDifficulty());

        assertEquals(TestFields.PYTHON_CODE, submissionDto.getCode());
        assertEquals(TestFields.PYTHON_LANGUAGE, submissionDto.getLanguage());
        assertEquals(submissionDto.getNumCorrect(), submissionDto.getNumTestCases());
        assertNull(submissionDto.getCompilationError());
        assertEquals(TestFields.RUNTIME, submissionDto.getRuntime());
        assertTrue(Instant.now().isAfter(submissionDto.getStartTime())
            || Instant.now().minusSeconds((long) 1).isBefore(submissionDto.getStartTime()));

        SubmissionResultDto resultDto = submissionDto.getResults().get(0);
        assertEquals(TestFields.OUTPUT, resultDto.getUserOutput());
        assertNull(resultDto.getError());
        assertEquals(TestFields.INPUT, resultDto.getInput());
        assertFalse(resultDto.isHidden());
        assertTrue(resultDto.isCorrect());
        
        assertFalse(game.getAllSolved());
    }

    @Test
    public void submitSolutionSuccess() {
        Room room = new Room();
        room.setRoomId(TestFields.ROOM_ID);
        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);

        List<Problem> problems = new ArrayList<>();
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);
        problem.setDescription(TestFields.DESCRIPTION);
        problem.setProblemId(TestFields.PROBLEM_ID);
        problem.setDifficulty(ProblemDifficulty.EASY);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(TestFields.INPUT);
        testCase.setOutput(TestFields.OUTPUT);
        problem.addTestCase(testCase);
        problems.add(problem);
        game.setProblems(problems);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setCode(TestFields.PYTHON_CODE);
        request.setInitiator(UserMapper.toDto(user));

        submitService.submitSolution(game, request);

        verify(submitService).getSubmission(captor.capture());
        TesterRequest testerRequest = captor.getValue();

        // Verify TesterRequest has non-required fields set to null
        assertNull(testerRequest.getProblem().getProblemId());
        assertNull(testerRequest.getProblem().getName());
        assertNull(testerRequest.getProblem().getDescription());
        assertNull(testerRequest.getProblem().getDifficulty());

        List<Submission> submissions = game.getPlayers().get(TestFields.USER_ID).getSubmissions();
        assertEquals(1, submissions.size());

        Submission submission = submissions.get(0);
        assertEquals(TestFields.PYTHON_CODE, submission.getPlayerCode().getCode());
        assertEquals(TestFields.PYTHON_LANGUAGE, submission.getPlayerCode().getLanguage());
        assertEquals(submission.getNumCorrect(), submission.getNumTestCases());
        assertNull(submission.getCompilationError());
        assertEquals(TestFields.RUNTIME, submission.getRuntime());
        assertTrue(Instant.now().isAfter(submission.getStartTime())
            || Instant.now().minusSeconds((long) 1).isBefore(submission.getStartTime()));

        SubmissionResult submissionResult = submission.getResults().get(0);
        assertEquals(TestFields.OUTPUT, submissionResult.getUserOutput());
        assertNull(submissionResult.getError());
        assertEquals(TestFields.INPUT, submissionResult.getInput());
        assertEquals(TestFields.OUTPUT, submissionResult.getCorrectOutput());
        assertFalse(submissionResult.isHidden());
        assertTrue(submissionResult.isCorrect());
        
        assertTrue(game.getAllSolved());
    }

    @Test
    public void submitSolutionNotAllSolvedSuccess() {
        Room room = new Room();
        room.setRoomId(TestFields.ROOM_ID);
        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);
        room.addUser(user);
        User user2 = new User();
        user2.setNickname(TestFields.NICKNAME_2);
        user2.setUserId(TestFields.USER_ID_2);
        room.addUser(user2);

        Game game = GameMapper.fromRoom(room);
        List<Problem> problems = new ArrayList<>();
        Problem problem = new Problem();
        problem.setName(TestFields.NAME);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(TestFields.INPUT);
        testCase.setOutput(TestFields.OUTPUT);
        problem.addTestCase(testCase);
        problems.add(problem);
        game.setProblems(problems);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setCode(TestFields.PYTHON_CODE);
        request.setInitiator(UserMapper.toDto(user));

        submitService.submitSolution(game, request);

        List<Submission> submissions = game.getPlayers().get(TestFields.USER_ID).getSubmissions();
        assertEquals(1, submissions.size());

        Submission submission = submissions.get(0);
        assertEquals(TestFields.PYTHON_CODE, submission.getPlayerCode().getCode());
        assertEquals(TestFields.PYTHON_LANGUAGE, submission.getPlayerCode().getLanguage());
        assertEquals(submission.getNumCorrect(), submission.getNumTestCases());
        assertNull(submission.getCompilationError());
        assertEquals(TestFields.RUNTIME, submission.getRuntime());
        assertTrue(Instant.now().isAfter(submission.getStartTime())
            || Instant.now().minusSeconds((long) 1).isBefore(submission.getStartTime()));

        SubmissionResult submissionResult = submission.getResults().get(0);
        assertEquals(TestFields.OUTPUT, submissionResult.getUserOutput());
        assertNull(submissionResult.getError());
        assertEquals(TestFields.INPUT, submissionResult.getInput());
        assertEquals(TestFields.OUTPUT, submissionResult.getCorrectOutput());
        assertFalse(submissionResult.isHidden());
        assertTrue(submissionResult.isCorrect());
        
        assertFalse(game.getAllSolved());
    }

    @Test
    public void callTesterServiceReturnsDummyResponse() throws Exception {
        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        ProblemDto problemDto = new ProblemDto();
        problemDto.setTestCases(Collections.singletonList(testCaseDto));

        TesterRequest request = new TesterRequest();
        request.setCode(TestFields.PYTHON_CODE);
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setProblem(problemDto);

        Submission response = submitService.getSubmission(request);

        assertNotNull(response);
        verify(submitService, never()).callTesterService(Mockito.any());
    }

    @Test
    public void callTesterServiceSuccessfulApiCall() throws Exception {
        submitService.setDebugModeForTesting(false);

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        ProblemDto problemDto = new ProblemDto();
        problemDto.setTestCases(Collections.singletonList(testCaseDto));

        TesterRequest request = new TesterRequest();
        request.setCode(TestFields.PYTHON_CODE);
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setProblem(problemDto);

        TesterResponse testerResponse = new TesterResponse();
        testerResponse.setNumCorrect(1);
        testerResponse.setNumTestCases(1);
        testerResponse.setRuntime(5.5);
        testerResponse.setResults(new ArrayList<>());

        Mockito.doReturn(testerResponse).when(submitService).callTesterService(request);
        Submission response = submitService.getSubmission(request);

        assertEquals(testerResponse.getNumCorrect(), response.getNumCorrect());
        assertEquals(testerResponse.getNumTestCases(), response.getNumTestCases());
        assertEquals(testerResponse.getRuntime(), response.getRuntime());
        assertEquals(request.getCode(), response.getPlayerCode().getCode());
        assertEquals(request.getLanguage(), response.getPlayerCode().getLanguage());
        assertNotNull(response.getStartTime());
    }

    @Test
    public void callTesterServiceTesterThrowsError() throws Exception {
        submitService.setDebugModeForTesting(false);

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        ProblemDto problemDto = new ProblemDto();
        problemDto.setTestCases(Collections.singletonList(testCaseDto));

        TesterRequest request = new TesterRequest();
        request.setCode(TestFields.PYTHON_CODE);
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setProblem(problemDto);

        TesterResponse testerResponse = new TesterResponse();
        testerResponse.setNumCorrect(1);
        testerResponse.setNumTestCases(1);
        testerResponse.setRuntime(5.5);

        TesterError ERROR = new TesterError(HttpStatus.BAD_REQUEST, new ApiErrorResponse("Bad input", "INVALID_INPUT"));

        Mockito.doThrow(new ApiException(ERROR)).when(submitService).callTesterService(request);

        ApiException exception = assertThrows(ApiException.class, () -> submitService.getSubmission(request));

        assertEquals(ERROR, exception.getError());
    }

    @Test
    public void callTesterServiceInternalError() throws Exception {
        submitService.setDebugModeForTesting(false);

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        ProblemDto problemDto = new ProblemDto();
        problemDto.setTestCases(Collections.singletonList(testCaseDto));

        TesterRequest request = new TesterRequest();
        request.setCode(TestFields.PYTHON_CODE);
        request.setLanguage(TestFields.PYTHON_LANGUAGE);
        request.setProblem(problemDto);

        TesterResponse testerResponse = new TesterResponse();
        testerResponse.setNumCorrect(1);
        testerResponse.setNumTestCases(1);
        testerResponse.setRuntime(5.5);

        // Use doAnswer to avoid checked exception mock error.
        Mockito.doAnswer(new Answer<Void>() {
            public Void answer(InvocationOnMock invocation) throws Exception {
                throw new Exception();
            }})
          .when(submitService).callTesterService(request);

        ApiException exception = assertThrows(ApiException.class, () -> submitService.getSubmission(request));

        assertEquals(GameError.TESTER_ERROR, exception.getError());
    }

    @Test
    public void callTesterServiceErrorWithPostRequest() {
        submitService.setDebugModeForTesting(false);

        TesterRequest request = new TesterRequest();
        request.setCode("temp");

        assertThrows(Exception.class, () -> submitService.callTesterService(request));

        ApiException exception = assertThrows(ApiException.class, () -> submitService.getSubmission(request));
        assertEquals(GameError.TESTER_ERROR, exception.getError());
    }
}
