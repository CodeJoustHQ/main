package com.rocketden.main.mapper;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.PlayerDto;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemTestCase;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class GameMapperTests {

    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String NICKNAME = "test";
    private static final String CODE = "print('hi')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;
    private static final int TEST_CASES = 10;

    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    // Helper method to add a dummy submission to a PlayerDto object
    private void addSubmissionHelper(PlayerDto playerDto, int numCorrect) {
        SubmissionDto submissionDto = new SubmissionDto();
        submissionDto.setNumCorrect(numCorrect);
        submissionDto.setStartTime(LocalDateTime.now());

        playerDto.getSubmissions().add(submissionDto);
    }

    @Test
    public void fromRoom() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);
        
        Game game = GameMapper.fromRoom(room);

        assertEquals(room, game.getRoom());
        assertNotNull(game.getPlayers().get(USER_ID));
        assertEquals(user, game.getPlayers().get(USER_ID).getUser());
        assertEquals(false, game.getAllSolved());
    }

    @Test
    public void playerFromUser() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);

        Player player = GameMapper.playerFromUser(user);

        assertEquals(user, player.getUser());
        assertNull(player.getPlayerCode());
        assertFalse(player.getSolved());
        assertEquals(0, player.getSubmissions().size());
    }

    @Test
    public void toDto() {
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.MEDIUM);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        testCase.setProblem(problem);

        List<Problem> problems = new ArrayList<>();
        problems.add(problem);

        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);
        game.setProblems(problems);
        game.setAllSolved(true);

        PlayerCode playerCode = new PlayerCode();
        playerCode.setCode(CODE);
        playerCode.setLanguage(LANGUAGE);

        Submission submission = new Submission();
        submission.setPlayerCode(playerCode);
        submission.setNumTestCases(TEST_CASES);
        submission.setNumCorrect(TEST_CASES);

        Player player = game.getPlayers().get(USER_ID);
        player.setSolved(true);
        player.setPlayerCode(playerCode);
        player.getSubmissions().add(submission);

        GameDto gameDto = GameMapper.toDto(game);

        assertEquals(RoomMapper.toDto(room), gameDto.getRoom());
        assertEquals(1, gameDto.getPlayers().size());
        assertEquals(ProblemMapper.toDto(problem), gameDto.getProblems().get(0));
        assertEquals(game.getAllSolved(), gameDto.getAllSolved());

        PlayerDto playerDto = gameDto.getPlayers().get(0);
        assertEquals(UserMapper.toDto(user), playerDto.getUser());
        assertEquals(player.getSolved(), playerDto.getSolved());
        assertEquals(playerCode.getCode(), playerDto.getCode());
        assertEquals(playerCode.getLanguage(), playerDto.getLanguage());
        assertEquals(1, playerDto.getSubmissions().size());

        SubmissionDto submissionDto = playerDto.getSubmissions().get(0);
        assertEquals(submission.getPlayerCode().getCode(), submissionDto.getCode());
        assertEquals(submission.getPlayerCode().getLanguage(), submissionDto.getLanguage());
        assertEquals(submission.getNumCorrect(), submissionDto.getNumCorrect());
        assertEquals(submission.getNumTestCases(), submissionDto.getNumTestCases());
        assertEquals(submission.getStartTime(), submissionDto.getStartTime());
    }

    @Test
    public void submissionToDto() {
        PlayerCode playerCode = new PlayerCode();
        playerCode.setCode(CODE);
        playerCode.setLanguage(LANGUAGE);

        Submission submission = new Submission();
        submission.setPlayerCode(playerCode);
        submission.setNumTestCases(TEST_CASES);
        submission.setNumCorrect(TEST_CASES);

        SubmissionDto submissionDto = GameMapper.submissionToDto(submission);
        assertEquals(submission.getPlayerCode().getCode(), submissionDto.getCode());
        assertEquals(submission.getPlayerCode().getLanguage(), submissionDto.getLanguage());
        assertEquals(submission.getNumCorrect(), submissionDto.getNumCorrect());
        assertEquals(submission.getStartTime(), submissionDto.getStartTime());
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
        GameMapper.sortLeaderboard(players);

        assertEquals(player4, players.get(0));
        assertEquals(player2, players.get(1));
        assertEquals(player3, players.get(2));
        assertEquals(player1, players.get(3));
        assertEquals(player5, players.get(4));
    }

    @Test
    public void toDtoSortsLeaderboard() {
        Submission sub1 = new Submission();
        sub1.setNumCorrect(0);
        Submission sub2 = new Submission();
        sub2.setNumCorrect(1);

        Player player1 = new Player();
        player1.getSubmissions().add(sub1);
        Player player2 = new Player();
        player2.getSubmissions().add(sub2);

        Game game = new Game();
        game.getPlayers().put("player1", player1);
        game.getPlayers().put("player2", player2);

        GameDto gameDto = GameMapper.toDto(game);

        List<PlayerDto> players = gameDto.getPlayers();

        assertEquals(2, players.size());
        assertEquals(1, players.get(0).getSubmissions().get(0).getNumCorrect());
        assertEquals(0, players.get(1).getSubmissions().get(0).getNumCorrect());
    }
}
