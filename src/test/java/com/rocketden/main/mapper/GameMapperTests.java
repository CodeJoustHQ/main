package com.rocketden.main.mapper;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class GameMapperTests {

    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String NICKNAME = "test";

    @Test
    public void fromRoom() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        room.addUser(user);
        
        Game game = GameMapper.fromRoom(room);

        assertEquals(room, game.getRoom());
        assertNotNull(game.getPlayers().get(USER_ID));
        assertEquals(user, game.getPlayers().get(USER_ID).getUser());
    }

    @Test
    public void playerFromUser() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);

        Player player = GameMapper.playerFromUser(user);

        assertEquals(user, player.getUser());
        assertNull(player.getPlayerCode());
        assertFalse(player.getSolved());
        assertEquals(0, player.getSubmissions().size());
    }

    @Test
    public void toDto() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        Game game = new Game();
        game.setRoom(room);

        GameDto gameDto = GameMapper.toDto(game);

        assertEquals(RoomMapper.toDto(room), gameDto.getRoomDto());
        // Assert player map is null for now until implemented
        assertNull(gameDto.getPlayerMap());
    }
}
