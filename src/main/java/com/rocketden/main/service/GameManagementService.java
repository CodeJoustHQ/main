package com.rocketden.main.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.notification.NotificationDto;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.GameNotification;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.problem.Problem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameManagementService {

    private final RoomRepository repository;
    private final SocketService socketService;
    private final LiveGameService liveGameService;
    private final NotificationService notificationService;
    private final SubmitService submitService;
    private Map<String, Game> currentGameMap;

    @Autowired
    protected GameManagementService(RoomRepository repository, SocketService socketService, LiveGameService liveGameService, NotificationService notificationService, SubmitService submitService) {
        this.repository = repository;
        this.socketService = socketService;
        this.liveGameService = liveGameService;
        this.notificationService = notificationService;
        this.submitService = submitService;
        currentGameMap = new HashMap<>();
    }

    public Game createAddGameFromRoom(Room room) {
        // TODO: Create the game from the room (or roomId).
        Game game = new Game();
        currentGameMap.put(room.getRoomId(), game);
        return null;
    }

    protected Game getGameFromRoomId(String roomId) {
        return currentGameMap.get(roomId);
    }

    protected void removeGame(String roomId) {
        currentGameMap.remove(roomId);
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
