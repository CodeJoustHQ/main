package com.rocketden.main.mapper;

import com.rocketden.main.dto.game.PlayerDto;
import com.rocketden.main.dto.game.PlayerMapper;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class PlayerMapperTests {

    private static final String USER_ID = "098765";
    private static final String NICKNAME = "test";

    @Test
    public void playerFromUser() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);

        Player player = PlayerMapper.playerFromUser(user);

        assertEquals(user, player.getUser());
        assertNull(player.getPlayerCode());
        assertFalse(player.getSolved());
        assertEquals(0, player.getSubmissions().size());
    }
}
