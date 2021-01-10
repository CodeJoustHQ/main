package com.rocketden.main.dto.game;

import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

import java.util.List;
import java.util.Map;

public class GameMapper {

    private static final ModelMapper mapper = new ModelMapper();

    protected GameMapper() {}

    public static GameDto toDto(Game game) {
        if (game == null) {
            return null;
        }

        GameDto gameDto = new GameDto();
        gameDto.setRoom(RoomMapper.toDto(game.getRoom()));

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);

        List<PlayerDto> players = gameDto.getPlayers();
        game.getPlayers().values().forEach(player -> players.add(mapper.map(player, PlayerDto.class)));

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

    public static SubmissionDto submissionToDto(Submission submission) {
        if (submission == null) {
            return null;
        }

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);

        return mapper.map(submission, SubmissionDto.class);
    }
}
