package com.rocketden.main.mapper;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.model.Room;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GameMapperTests {

    private static final String ROOM_ID = "012345";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    @Test
    public void fromRoom() {
        Room room = new Room();

        // TODO
        
        Game game = GameMapper.fromRoom(room);
        assertEquals(room, game.getRoom());
    }
}
