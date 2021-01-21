package com.rocketden.main.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.GameNotificationDto;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.util.EndGameTimerTask;
import com.rocketden.main.util.NotificationTimerTask;
import com.rocketden.main.util.Utility;

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
        if (!request.getInitiator().getNickname().equals(room.getHost().getNickname())) {
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

    // Initialize and add a game object from a room object, start game timer
    public void createAddGameFromRoom(Room room) {
        Game game = GameMapper.fromRoom(room);
        Long time = room.getDuration();

        List<Problem> problems = problemService.getProblemsFromDifficulty(room.getDifficulty(), room.getNumProblems());
        game.setProblems(problems);
        setStartGameTimer(game, time);

        currentGameMap.put(room.getRoomId(), game);

        // Create notifications for different "time left" milestones.
        if (GameTimer.DURATION_60 < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "are sixty minutes");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_60) * 1000);
        }
        
        if (GameTimer.DURATION_30 < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "are thirty minutes");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_30) * 1000);
        }
        
        if (GameTimer.DURATION_15 < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "are fifteen minutes");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_15) * 1000);
        }
        
        if (GameTimer.DURATION_5 < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "are five minutes");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_5) * 1000);
        }
        
        if (GameTimer.DURATION_1 < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "is one minute");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_1) * 1000);
        }

        if (GameTimer.DURATION_30_SEC < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "are thirty seconds");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_30_SEC) * 1000);
        }

        if (GameTimer.DURATION_10_SEC < time) {
            Timer timer = new Timer();
            NotificationTimerTask notificationTimerTask =
                new NotificationTimerTask(socketService, room.getRoomId(), "are ten seconds");
            timer.schedule(notificationTimerTask, (time - GameTimer.DURATION_10_SEC) * 1000);
        }
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
    public GameNotificationDto sendNotification(String roomId, GameNotificationDto notificationDto) {
        Game game = getGameFromRoomId(roomId);

        /**
         * The notification type must be present.
         * 
         * If the initiator exists on the notificationDto (not required),
         * then ensure that they exist in the room.
         * 
         * If initiator does not exist, ensure that the notification type 
         * does not require an initiator.
         */
        if (notificationDto.getNotificationType() == null) {
            throw new ApiException(GameError.EMPTY_FIELD);
        } else if (notificationDto.getInitiator() != null
            && !game.getPlayers().containsKey(notificationDto.getInitiator().getUserId())) {
            throw new ApiException(GameError.USER_NOT_IN_GAME);
        } else if (notificationDto.getInitiator() == null
            && Utility.initiatorNotifications.contains(notificationDto.getNotificationType())) {
            throw new ApiException(GameError.NOTIFICATION_REQUIRES_INITIATOR);
        } else if (notificationDto.getContent() == null
            && Utility.contentNotifications.contains(notificationDto.getNotificationType())) {
            throw new ApiException(GameError.NOTIFICATION_REQUIRES_CONTENT);       
        }

        return notificationService.sendNotification(roomId, notificationDto);
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
