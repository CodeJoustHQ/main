package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.PlayAgainRequest;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.model.problem.ProblemDifficulty;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class GameManagementServiceTests {

    @Mock
    private RoomRepository repository;

    @Mock
    private SocketService socketService;

    @Mock
    private SubmitService submitService;

    @Mock
    private ProblemService problemService;

    @Mock
    private LiveGameService liveGameService;

    @Spy
    @InjectMocks
    private GameManagementService gameService;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String SESSION_ID = "abcdefghijk";
    private static final String CODE = "print('hi')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;
    private static final PlayerCode PLAYER_CODE = new PlayerCode(CODE, LANGUAGE);
    private static final long DURATION = 600;

    @Test
    public void addGetAndRemoveGame() {
        // Initially, room doesn't exist
        ApiException exception = assertThrows(ApiException.class, () -> gameService.getGameFromRoomId(ROOM_ID));
        assertEquals(GameError.NOT_FOUND, exception.getError());

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.RANDOM);

        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        // Create a game from a room
        gameService.createAddGameFromRoom(room);

        // Confirm that the problem service method is called correctly.
        verify(problemService).getProblemsFromDifficulty(eq(room.getDifficulty()), eq(1));

        // Check that game has copied over the correct details
        Game game = gameService.getGameFromRoomId(ROOM_ID);
        assertEquals(room, game.getRoom());
        assertEquals(user, game.getPlayers().get(USER_ID).getUser());

        gameService.removeGame(ROOM_ID);

        // Check that game has been removed
        exception = assertThrows(ApiException.class, () -> gameService.getGameFromRoomId(ROOM_ID));
        assertEquals(GameError.NOT_FOUND, exception.getError());
    }

    @Test
    public void startGameSuccess() {
        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);
        room.setDifficulty(ProblemDifficulty.RANDOM);
        room.setDuration(DURATION);

        StartGameRequest request = new StartGameRequest();
        request.setInitiator(UserMapper.toDto(host));

        Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
        RoomDto response = gameService.startGame(ROOM_ID, request);

        // Confirm that the problem service method is called correctly.
        verify(problemService).getProblemsFromDifficulty(eq(room.getDifficulty()), eq(1));

        verify(socketService).sendSocketUpdate(eq(response));

        assertEquals(ROOM_ID, response.getRoomId());
        assertTrue(response.isActive());

        // Game object is created when the room chooses to start
        Game game = gameService.getGameFromRoomId(ROOM_ID);
        assertNotNull(game);

        assertNotNull(game.getGameTimer());
        assertEquals(room.getDuration(), game.getGameTimer().getDuration());
    }

    @Test
    public void startGameRoomNotFound() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);

        StartGameRequest request = new StartGameRequest();
        request.setInitiator(user);

        Mockito.doReturn(null).when(repository).findRoomByRoomId(ROOM_ID);
        ApiException exception = assertThrows(ApiException.class, () -> gameService.startGame(ROOM_ID, request));
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void startGameWrongInitiator() {
        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);

        UserDto initiator = new UserDto();
        initiator.setNickname(NICKNAME_2);

        StartGameRequest request = new StartGameRequest();
        request.setInitiator(initiator);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
        ApiException exception = assertThrows(ApiException.class, () -> gameService.startGame(ROOM_ID, request));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void getGameSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.RANDOM);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        gameService.createAddGameFromRoom(room);

        // Confirm that the problem service method is called correctly.
        verify(problemService).getProblemsFromDifficulty(eq(room.getDifficulty()), eq(1));

        GameDto gameDto = gameService.getGameDtoFromRoomId(ROOM_ID);

        assertEquals(RoomMapper.toDto(room), gameDto.getRoom());

        assertEquals(1, gameDto.getPlayers().size());
        assertEquals(UserMapper.toDto(user), gameDto.getPlayers().get(0).getUser());
        assertNotNull(gameDto.getGameTimer());
        assertEquals(room.getDuration(), gameDto.getGameTimer().getDuration());
    }

    @Test
    public void getGameNotFound() {
        ApiException exception = assertThrows(ApiException.class, () -> gameService.getGameDtoFromRoomId(ROOM_ID));
        assertEquals(GameError.NOT_FOUND, exception.getError());
    }

    @Test
    public void submitSolutionSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        gameService.createAddGameFromRoom(room);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(LANGUAGE);
        request.setCode(CODE);
        request.setInitiator(UserMapper.toDto(user));

        gameService.submitSolution(ROOM_ID, request);

        verify(submitService).submitSolution(any(Game.class), eq(request));
    }

    @Test
    public void submitSolutionInvalidPermissions() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        gameService.createAddGameFromRoom(room);

        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage(LANGUAGE);
        request.setCode(CODE);
        request.setInitiator(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () -> gameService.submitSolution(ROOM_ID, request));
        assertEquals(GameError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void submitSolutionEmptyField() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        gameService.createAddGameFromRoom(room);

        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);

        SubmissionRequest missingRequest = new SubmissionRequest();
        missingRequest.setLanguage(null);
        missingRequest.setCode(CODE);
        missingRequest.setInitiator(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () -> gameService.submitSolution(ROOM_ID, missingRequest));
        assertEquals(GameError.EMPTY_FIELD, exception.getError());
    }

    @Test
    public void playAgainSuccess() throws Exception {
        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        host.setSessionId(SESSION_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);
        room.setDifficulty(ProblemDifficulty.HARD);
        room.setActive(true);
        room.addUser(host);
        room.setDuration(1L);

        StartGameRequest request = new StartGameRequest();
        request.setInitiator(UserMapper.toDto(host));

        Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
        gameService.startGame(ROOM_ID, request);
        Thread.sleep(1000);

        PlayAgainRequest playAgainRequest = new PlayAgainRequest();
        playAgainRequest.setInitiator(UserMapper.toDto(host));
        RoomDto response = gameService.playAgain(ROOM_ID, playAgainRequest);

        Game game = gameService.getGameFromRoomId(room.getRoomId());

        verify(socketService).sendSocketUpdate(Mockito.eq(GameMapper.toDto(game)));

        assertTrue(game.getPlayAgain());
        assertEquals(room.getRoomId(), response.getRoomId());
        assertEquals(room.getDifficulty(), response.getDifficulty());
        assertFalse(room.getActive());
        assertNull(room.getHost().getSessionId());
    }

    @Test
    public void playAgainWrongInitiator() throws Exception {
        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);
        room.setDuration(1L);

        StartGameRequest startRequest = new StartGameRequest();
        startRequest.setInitiator(UserMapper.toDto(host));

        Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
        gameService.startGame(ROOM_ID, startRequest);
        Thread.sleep(1000);

        UserDto initiator = new UserDto();
        initiator.setNickname(NICKNAME_2);
        PlayAgainRequest request = new PlayAgainRequest();
        request.setInitiator(initiator);

        ApiException exception = assertThrows(ApiException.class, () -> gameService.playAgain(ROOM_ID, request));
        assertEquals(GameError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void playAgainGameNotOver() {
        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);

        StartGameRequest startRequest = new StartGameRequest();
        startRequest.setInitiator(UserMapper.toDto(host));

        Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
        gameService.startGame(ROOM_ID, startRequest);

        PlayAgainRequest request = new PlayAgainRequest();
        request.setInitiator(UserMapper.toDto(host));

        ApiException exception = assertThrows(ApiException.class, () -> gameService.playAgain(ROOM_ID, request));
        assertEquals(GameError.GAME_NOT_OVER, exception.getError());
    }

    @Test
    public void updateCodeSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.RANDOM);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        gameService.createAddGameFromRoom(room);
        Game game = gameService.getGameFromRoomId(ROOM_ID);
        gameService.updateCode(ROOM_ID, USER_ID, PLAYER_CODE);

        Player player = game.getPlayers().get(USER_ID);

        // Confirm that the live game service method is called correctly.
        verify(liveGameService).updateCode(eq(player), eq(PLAYER_CODE));
    }

    @Test
    public void updateCodeInvalidRoomId() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.RANDOM);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        gameService.createAddGameFromRoom(room);
        ApiException exception = assertThrows(ApiException.class, () -> gameService.updateCode("999999", USER_ID, PLAYER_CODE));
        assertEquals(GameError.NOT_FOUND, exception.getError());
    }

    @Test
    public void updateCodeInvalidUserId() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.RANDOM);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        gameService.createAddGameFromRoom(room);
        ApiException exception = assertThrows(ApiException.class, () -> gameService.updateCode(ROOM_ID, "999999", PLAYER_CODE));
        assertEquals(GameError.USER_NOT_IN_GAME, exception.getError());
    }

    @Test
    public void updateCodeEmptyPlayerCode() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setDifficulty(ProblemDifficulty.RANDOM);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);

        gameService.createAddGameFromRoom(room);
        ApiException exception = assertThrows(ApiException.class, () -> gameService.updateCode(ROOM_ID, USER_ID, null));
        assertEquals(GameError.EMPTY_FIELD, exception.getError());
    }
}
