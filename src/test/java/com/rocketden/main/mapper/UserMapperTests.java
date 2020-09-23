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

        UserDto response = UserMapper.toDto(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
    }

    @Test
    public void dtoToEntity() {
        UserDto user = new UserDto();
        user.setNickname("rocket");

        User response = UserMapper.toEntity(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
    }

    @Test
    public void nullUserMappings() {
        assertNull(UserMapper.toDto(null));
        assertNull(UserMapper.toEntity(null));
    }
}
