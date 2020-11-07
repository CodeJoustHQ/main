package com.rocketden.main.service;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.model.Room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameManagementService {

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
        currentGameMap.put(game.getRoom().getRoomId(), game);
        return null;
    }

    protected Game getGameFromRoomId(String roomId) {
        return currentGameMap.get(roomId);
    }

    protected void removeGame(String roomId) {
        currentGameMap.remove(roomId);
    }

}
