package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.CreateUserResponse;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository repository;

    @Spy
    @InjectMocks
    private UserService service;

    @Test
    public void createUserSuccess() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket");

        CreateUserResponse response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals(CreateUserResponse.SUCCESS, response.getMessage());
        assertEquals("rocket", response.getNickname());
    }
}
