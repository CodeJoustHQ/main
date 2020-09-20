package com.rocketden.main.mapper;

import com.rocketden.main.dto.user.CreateUserResponse;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@SpringBootTest
public class UserMapperTests {

    @Test
    public void entityToCreateUserResponse() {
        User user = new User();
        user.setNickname("rocket");

        CreateUserResponse response = UserMapper.entityToCreateResponse(user);

        assertNotNull(response);
        assertEquals(user.getNickname(), response.getNickname());
    }
}
