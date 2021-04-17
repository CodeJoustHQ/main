package com.codejoust.main.util;

import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

import com.codejoust.main.dto.game.GameDto;
import com.codejoust.main.dto.game.GameMapper;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.Game;
import com.codejoust.main.game_object.GameTimer;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.service.SocketService;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class EndGameTimerTaskTests {

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String SESSION_ID = "234567";
    private static final String ROOM_ID = "012345";

    @Mock
    private SocketService socketService;

    @BeforeEach
    public void setup() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void endGameTimerTaskSocketMessageNullGame() {
        assertThrows(ApiException.class, () -> new EndGameTimerTask(socketService, null));
    }

    @Test
    public void endGameTimerTaskSocketMessageNullSocketService() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        user.setSessionId(SESSION_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.MEDIUM);
        room.setHost(user);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);
        GameTimer gameTimer = new GameTimer(10L);
        game.setGameTimer(gameTimer);

        assertThrows(ApiException.class, () -> new EndGameTimerTask(null, game));
    }

    @Test
    public void endGameTimerTaskSocketMessageNullGameTimer() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        user.setSessionId(SESSION_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.MEDIUM);
        room.setHost(user);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);

        assertThrows(ApiException.class, () -> new EndGameTimerTask(socketService, game));
    }

    @Test
    public void endGameTimerTaskSocketMessageNullRoom() {
        Game game = new Game();
        GameTimer gameTimer = new GameTimer(10L);
        game.setGameTimer(gameTimer);

        assertThrows(ApiException.class, () -> new EndGameTimerTask(socketService, game));
    }

    @Test
    public void endGameTimerTaskSocketMessageNullRoomId() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        user.setSessionId(SESSION_ID);

        Room room = new Room();
        room.setDifficulty(ProblemDifficulty.MEDIUM);
        room.setHost(user);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);
        GameTimer gameTimer = new GameTimer(10L);
        game.setGameTimer(gameTimer);

        assertThrows(ApiException.class, () -> new EndGameTimerTask(socketService, game));
    }

    @Test
    public void endGameTimerTaskSocketMessage() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        user.setSessionId(SESSION_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.MEDIUM);
        room.setHost(user);
        room.addUser(user);

        Game game = GameMapper.fromRoom(room);
        GameTimer gameTimer = new GameTimer(1L);
        game.setGameTimer(gameTimer);

        // Make the Game DTO update that will occur on timer end.
        GameDto gameDto = GameMapper.toDto(game);
        gameDto.getGameTimer().setTimeUp(true);

        MockitoAnnotations.initMocks(this);

        EndGameTimerTask endGameTimerTask = new EndGameTimerTask(socketService, game);
        gameTimer.getTimer().schedule(endGameTimerTask,  1000L);

        /**
         * Confirm that the socket update is not called immediately, 
         * but is called 1 second later (wait for timer task).
         */

        verify(socketService, never()).sendSocketUpdate(eq(gameDto));

        verify(socketService, timeout(1000)).sendSocketUpdate(eq(gameDto));
    }
}
