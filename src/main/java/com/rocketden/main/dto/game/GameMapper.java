package com.rocketden.main.dto.game;

import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import java.util.Map;

public class GameMapper {

    protected GameMapper() {}

    public static GameDto toDto(Game game) {
        if (game == null) {
            return null;
        }

        // For now, just include the room info in the GameDto
        GameDto gameDto = new GameDto();
        gameDto.setRoomDto(RoomMapper.toDto(game.getRoom()));
        gameDto.setGameTimer(GameTimerMapper.toDto(game.getGameTimer()));

        return gameDto;
    }

    public static Game fromRoom(Room room) {
        if (room == null) {
            return null;
        }

        Game game = new Game();
        game.setRoom(room);

        Map<String, Player> players = game.getPlayers();
        for (User user : room.getUsers()) {
            Player player = playerFromUser(user);
            players.put(user.getUserId(), player);
        }

        return game;
    }

    public static Player playerFromUser(User user) {
        if (user == null) {
            return null;
        }

        Player player = new Player();
        player.setUser(user);

        return player;
    }
}
