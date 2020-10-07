package com.rocketden.main.mapper;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@SpringBootTest
public class UserMapperTests {

    @Test
    public void entityToDto() {
        User user = new User();
        user.setNickname("rocket");
        user.setUserId("678910");
        user.setSessionId("012345");

        UserDto response = UserMapper.toDto(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
        assertEquals(user.getUserId(), response.getUserId());
        assertEquals(user.getSessionId(), response.getSessionId());
    }

    @Test
    public void dtoToEntity() {
        UserDto user = new UserDto();
        user.setNickname("rocket");
        user.setUserId("6798910");
        user.setSessionId("012345");

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
