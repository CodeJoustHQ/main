package com.rocketden.main.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.notification.NotificationDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.GameNotification;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.model.Room;
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
    protected GameManagementService(RoomRepository repository, SocketService socketService, LiveGameService liveGameService, NotificationService notificationService, SubmitService submitService, ProblemService problemService) {
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
        if (!request.getInitiator().getNickname().equals(room.getHost().getNickname())) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        room.setActive(true);
        repository.save(room);

        // Initialize game state
        createAddGameFromRoom(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    // Initialize and add a game object from a room object, start game timer
    public void createAddGameFromRoom(Room room) {
        Game game = GameMapper.fromRoom(room);
        List<Problem> problems = problemService.getProblemsFromDifficulty(room.getDifficulty(), 1);
        game.setProblems(problems);
        currentGameMap.put(room.getRoomId(), game);
        setStartGameTimer(game, GameTimer.DURATION_15);
    }

    // Set and start the Game Timer.
    public void setStartGameTimer(Game game, Long duration) {
        GameTimer gameTimer = new GameTimer(duration);
        game.setGameTimer(gameTimer);

        // Schedule the game to end after <duration> seconds.
        EndGameTimerTask endGameTimerTask = new EndGameTimerTask(socketService, game);
        gameTimer.getTimer().schedule(endGameTimerTask, duration * 1000);
    }

    // Test the submission and return a socket update.
    public GameDto testSubmission(String userId, String roomId) {
        // TODO: Get the player and game.
        return submitService.testSubmission(new Player(), new Problem());
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
    public void updateCode(String userId, PlayerCode playerCode) {
        // TODO: Get the player from the userId.
        liveGameService.updateCode(new Player(), playerCode);
    }

}
