package com.rocketden.main.mapper;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
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

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class GameMapperTests {

    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String NICKNAME = "test";

    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

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

        Game game = new Game();
        game.setRoom(room);
        game.setProblems(problems);

        GameDto gameDto = GameMapper.toDto(game);

        assertEquals(RoomMapper.toDto(room), gameDto.getRoom());
        assertEquals(ProblemMapper.toDto(problem), gameDto.getProblems().get(0));
        // Assert player map is null for now until implemented
        assertNull(gameDto.getPlayerMap());
    }
}
