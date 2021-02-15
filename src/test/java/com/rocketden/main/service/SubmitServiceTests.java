package com.rocketden.main.service;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.game.TesterRequest;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.model.problem.Problem;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
public class SubmitServiceTests {

    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "098765";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "345678";
    private static final String ROOM_ID = "012345";
    private static final String CODE = "print('hi')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;

    @Spy
    @InjectMocks
    private SubmitService submitService;

    @Test
    public void submitSolutionSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);

        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem());
        game.setProblems(problems);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(LANGUAGE);
        request.setCode(CODE);
        request.setInitiator(UserMapper.toDto(user));

        submitService.submitSolution(game, request);

        List<Submission> submissions = game.getPlayers().get(USER_ID).getSubmissions();
        assertEquals(1, submissions.size());

        Submission submission = submissions.get(0);

        assertEquals(CODE, submission.getPlayerCode().getCode());
        assertEquals(LANGUAGE, submission.getPlayerCode().getLanguage());
        assertEquals(submission.getNumCorrect(), submission.getNumTestCases());
        assertNotNull(submission.getRuntime());
        assertTrue(game.getAllSolved());
    }

    @Test
    public void submitSolutionNotAllSolvedSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);
        User user2 = new User();
        user2.setNickname(NICKNAME_2);
        user2.setUserId(USER_ID_2);
        room.addUser(user2);

        Game game = GameMapper.fromRoom(room);
        List<Problem> problems = new ArrayList<>();
        problems.add(new Problem());
        game.setProblems(problems);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(LANGUAGE);
        request.setCode(CODE);
        request.setInitiator(UserMapper.toDto(user));

        submitService.submitSolution(game, request);

        List<Submission> submissions = game.getPlayers().get(USER_ID).getSubmissions();
        assertEquals(1, submissions.size());

        Submission submission = submissions.get(0);

        assertEquals(CODE, submission.getPlayerCode().getCode());
        assertEquals(LANGUAGE, submission.getPlayerCode().getLanguage());
        assertEquals(submission.getNumCorrect(), submission.getNumTestCases());
        assertNotNull(submission.getRuntime());
        assertFalse(game.getAllSolved());
    }

    @Test
    public void callTesterServiceReturnsDummyResponse() {
        TesterRequest request = new TesterRequest();
        request.setCode(CODE);
        request.setLanguage(LANGUAGE);
        request.setProblem(new ProblemDto());

        Submission response = submitService.getSubmission(request);

        assertNotNull(response);
    }

    @Test
    public void callTesterServiceSuccessfulApiCall() {
        submitService.setDebugModeForTesting(false);

    }

    @Test
    public void callTesterServiceTesterThrowsError() {
        submitService.setDebugModeForTesting(false);

    }

    @Test
    public void callTesterServiceInternalError() {
        submitService.setDebugModeForTesting(false);

    }

    @Test
    public void callTesterServiceFailsNoDebug() {
        submitService.setDebugModeForTesting(false);

        TesterRequest request = new TesterRequest();
        request.setCode("temp");

        ApiException exception = assertThrows(ApiException.class, () -> submitService.callTesterService(request));

        assertEquals(GameError.TESTER_ERROR, exception.getError());
    }
}
