package com.codejoust.main.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.model.User;

@SpringBootTest
public class UserMapperTests {

    // Predefine user attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String SESSION_ID = "234567";

    @Test
    public void entityToDto() {
        User user = new User();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        user.setSessionId(SESSION_ID);

        UserDto response = UserMapper.toDto(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
        assertEquals(user.getUserId(), response.getUserId());
        assertEquals(user.getSessionId(), response.getSessionId());
    }

    @Test
    public void dtoToEntity() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        user.setSessionId(SESSION_ID);

        User response = UserMapper.toEntity(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
        assertEquals(user.getUserId(), response.getUserId());
        assertEquals(user.getSessionId(), response.getSessionId());
    }

    @Test
    public void nullUserMappings() {
        assertNull(UserMapper.toDto(null));
        assertNull(UserMapper.toEntity(null));
    }
}
