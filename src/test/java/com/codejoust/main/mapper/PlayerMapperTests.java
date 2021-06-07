package com.codejoust.main.mapper;

import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.codejoust.main.dto.game.PlayerMapper;
import com.codejoust.main.game_object.Player;
import com.codejoust.main.model.User;

@SpringBootTest
public class PlayerMapperTests {

    @Test
    public void playerFromUser() {
        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);

        Player player = PlayerMapper.playerFromUser(user);

        assertEquals(user, player.getUser());
        assertNull(player.getPlayerCode());
        assertEquals(new boolean[]{false}, player.getSolved());
        assertEquals(0, player.getSubmissions().size());
    }
}
