package com.rocketden.main.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.PlayAgainRequest;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.notification.NotificationDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.GameNotification;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.util.EndGameTimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameManagementService {

    private final RoomRepository repository;
    private final SocketService socketService;
    private final LiveGameService liveGameService;
    private final NotificationService notificationService;
    private final SubmitService submitService;
    private final ProblemService problemService;
    private final Map<String, Game> currentGameMap;

    @Autowired
    protected GameManagementService(RoomRepository repository, SocketService socketService,
                                    LiveGameService liveGameService, NotificationService notificationService,
                                    SubmitService submitService, ProblemService problemService) {
        this.repository = repository;
        this.socketService = socketService;
        this.liveGameService = liveGameService;
        this.notificationService = notificationService;
        this.submitService = submitService;
        this.problemService = problemService;
        currentGameMap = new HashMap<>();
    }

    protected Game getGameFromRoomId(String roomId) {
        Game game = currentGameMap.get(roomId);
        if (game == null) {
            throw new ApiException(GameError.NOT_FOUND);
        }

        return game;
    }

    protected void removeGame(String roomId) {
        currentGameMap.remove(roomId);
    }

    public GameDto getGameDtoFromRoomId(String roomId) {
        return GameMapper.toDto(getGameFromRoomId(roomId));
    }

    // When host starts the game, redirect everyone and initialize the game state
    public RoomDto startGame(String roomId, StartGameRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

        // If requested room does not exist in database, throw an exception.
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // If user making request is not the host, throw an exception.
        User initiator = UserMapper.toEntity(request.getInitiator());
        if (!room.getHost().equals(initiator)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Initialize game state
        createAddGameFromRoom(room);

        room.setActive(true);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    // TODO: add verification that game is over
    public RoomDto playAgain(String roomId, PlayAgainRequest request) {
        Room room = getGameFromRoomId(roomId).getRoom();

        User initiator = UserMapper.toEntity(request.getInitiator());
        if (!room.getHost().equals(initiator)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Set all users to be disconnected
        room.getUsers().forEach((user) -> user.setSessionId(null));

        // Change room to be no longer active
        room.setActive(false);

        // TODO: figure out socket message (and test in GameSocketTests)

        return RoomMapper.toDto(room);
    }

    // Initialize and add a game object from a room object, start game timer
    public void createAddGameFromRoom(Room room) {
        Game game = GameMapper.fromRoom(room);

        List<Problem> problems = problemService.getProblemsFromDifficulty(room.getDifficulty(), room.getNumProblems());
        game.setProblems(problems);
        setStartGameTimer(game, room.getDuration());

        currentGameMap.put(room.getRoomId(), game);
    }

    // Set and start the Game Timer.
    public void setStartGameTimer(Game game, Long duration) {
        GameTimer gameTimer = new GameTimer(duration);
        game.setGameTimer(gameTimer);

        // Schedule the game to end after <duration> seconds.
        EndGameTimerTask endGameTimerTask = new EndGameTimerTask(socketService, game);
        gameTimer.getTimer().schedule(endGameTimerTask, duration * 1000);
    }

    // Test the submission, return the results, and send a socket update
    public SubmissionDto submitSolution(String roomId, SubmissionRequest request) {
        Game game = getGameFromRoomId(roomId);

        if (request.getInitiator() == null || request.getCode() == null || request.getLanguage() == null) {
            throw new ApiException(GameError.EMPTY_FIELD);
        }

        String initiatorUserId = request.getInitiator().getUserId();
        if (!game.getPlayers().containsKey(initiatorUserId)) {
            throw new ApiException(GameError.INVALID_PERMISSIONS);
        }

        return submitService.submitSolution(game, request);
    }

    // Send a notification through a socket update.
    public NotificationDto sendNotification(List<String> userIdList) {
        /**
         * TODO: Get the players from the userIdList,
         * receive a game notification with details.
         */
        return notificationService.sendNotification(GameNotification.SUBMIT_CORRECT, new ArrayList<>());
    }

    // Update a specific player's code.
    public void updateCode(String roomId, String userId, PlayerCode playerCode) {
        Game game = getGameFromRoomId(roomId);

        if (!game.getPlayers().containsKey(userId)) {
            throw new ApiException(GameError.USER_NOT_IN_GAME);
        } else if (playerCode == null) {
            throw new ApiException(GameError.EMPTY_FIELD);
        }

        liveGameService.updateCode(game.getPlayers().get(userId), playerCode);
    }

}
