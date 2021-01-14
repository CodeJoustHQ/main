package com.rocketden.main.service;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.PlayerDto;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class SubmitServiceTests {

    private static final String NICKNAME = "rocket";
    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String CODE = "print('hi')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;

    @Mock
    private SocketService socketService;

    @Spy
    @InjectMocks
    private SubmitService submitService;

    @Test
    public void submitSolutionSuccess() {
        /**
         * TODO: For now, this just checks that the submission is stored correctly.
         * In the future, it will likely call the tester endpoint and send a socket update too.
         */

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(LANGUAGE);
        request.setCode(CODE);
        request.setInitiator(UserMapper.toDto(user));

        submitService.submitSolution(game, request);

        GameDto gameDto = GameMapper.toDto(game);
        verify(socketService).sendSocketUpdate(gameDto);
        verify(submitService).sortLeaderboard(gameDto.getPlayers());

        List<Submission> submissions = game.getPlayers().get(USER_ID).getSubmissions();
        assertEquals(1, submissions.size());

        Submission submission = submissions.get(0);

        assertEquals(CODE, submission.getPlayerCode().getCode());
        assertEquals(LANGUAGE, submission.getPlayerCode().getLanguage());
        assertEquals(submission.getNumCorrect(), submission.getNumTestCases());
    }

    @Test
    public void sortLeaderboardSuccess() {
        List<PlayerDto> players = new ArrayList<>();

        PlayerDto player1 = new PlayerDto();
        addSubmissionHelper(player1, 0);

        PlayerDto player2 = new PlayerDto();
        addSubmissionHelper(player2, 0);
        addSubmissionHelper(player2, 3);

        PlayerDto player3 = new PlayerDto();
        addSubmissionHelper(player3, 3);

        PlayerDto player4 = new PlayerDto();
        addSubmissionHelper(player4, 5);

        PlayerDto player5 = new PlayerDto();

        players.add(player1);
        players.add(player2);
        players.add(player3);
        players.add(player4);
        players.add(player5);

        // Player order should be: [4, 2, 3, 1, 5]
        submitService.sortLeaderboard(players);

        assertEquals(player4, players.get(0));
        assertEquals(player2, players.get(1));
        assertEquals(player3, players.get(2));
        assertEquals(player1, players.get(3));
        assertEquals(player5, players.get(4));
    }

    // Helper method to add a dummy submission to a PlayerDto object
    private void addSubmissionHelper(PlayerDto playerDto, int numCorrect) {
        SubmissionDto submissionDto = new SubmissionDto();
        submissionDto.setNumCorrect(numCorrect);
        submissionDto.setStartTime(LocalDateTime.now());

        playerDto.getSubmissions().add(submissionDto);
    }
}
