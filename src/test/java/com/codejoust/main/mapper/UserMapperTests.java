package com.codejoust.main.mapper;

import com.codejoust.main.util.TestFields;
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

    @Test
    public void entityToDto() {
        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);
        user.setSessionId(TestFields.SESSION_ID);

        UserDto response = UserMapper.toDto(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
        assertEquals(user.getUserId(), response.getUserId());
        assertEquals(user.getSessionId(), response.getSessionId());
    }

    @Test
    public void dtoToEntity() {
        UserDto user = new UserDto();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);
        user.setSessionId(TestFields.SESSION_ID);

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
