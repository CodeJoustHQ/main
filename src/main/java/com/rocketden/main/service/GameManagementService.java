package com.rocketden.main.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.notification.NotificationDto;
import com.rocketden.main.model.Game;
import com.rocketden.main.model.PlayerCode;
import com.rocketden.main.model.Room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public abstract class GameManagementService {

    private final RoomRepository repository;
    private final SocketService socketService;
    private Map<String, Game> currentGameMap;

    @Autowired
    protected GameManagementService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
        currentGameMap = new HashMap<>();
    }

    public Game createAddGameFromRoom(Room room) {
        // TODO: Create the game from the room (or roomId).
        Game game = new Game();
        currentGameMap.put(game.getRoomId(), game);
        return null;
    }

    protected Game getGameFromRoomId(String roomId) {
        return currentGameMap.get(roomId);
    }

    protected void removeGame(String roomId) {
        currentGameMap.remove(roomId);
    }

    // Test the submission and return a socket update.
    abstract GameDto testSubmission(String userId, String roomId);

    // Send a notification through a socket update.
    abstract NotificationDto sendNotification(List<String> userIdList);

    // Update a specific player's code.
    abstract void updateCode(String userId, PlayerCode playerCode);

}
