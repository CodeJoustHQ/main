package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.User;
import com.rocketden.main.util.Utility;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository repository;

    @Mock
    private Utility utility;

    @Spy
    @InjectMocks
    private UserService service;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";

    @Test
    public void createUserSuccess() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(NICKNAME);
        request.setUserId(USER_ID);

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals(NICKNAME, response.getNickname());
        assertEquals(USER_ID, response.getUserId());
    }

    @Test
    public void createUserNoUserIdSuccess() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(NICKNAME);

        Mockito.doReturn(USER_ID).when(utility).generateUniqueId(eq(UserService.USER_ID_LENGTH), eq(Utility.USER_ID_KEY));

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals(NICKNAME, response.getNickname());
        assertEquals(USER_ID, response.getUserId());
    }

    @Test
    public void createUserInvalidNickname() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket rocket");

        ApiException exception = assertThrows(ApiException.class, () -> {
            service.createUser(request);
        });

        assertEquals(UserError.INVALID_USER, exception.getError());
    }
}
