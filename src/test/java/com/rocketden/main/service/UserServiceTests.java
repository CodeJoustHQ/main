package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.DeleteUserRequest;
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

    @Test
    public void createUserSuccess() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket");
        request.setUserId("012345");

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals("rocket", response.getNickname());
        assertEquals("012345", response.getUserId());
    }

    @Test
    public void createUserNoUserIdSuccess() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket");

        Mockito.doReturn("012345").when(utility).generateId(eq(UserService.USER_ID_LENGTH));

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals("rocket", response.getNickname());
        assertEquals("012345", response.getUserId());
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

    @Test
    public void deleteExistingUser() {
        User user = new User();
        user.setNickname("rocket");
        user.setUserId("012345");
        when(repository.findUserByUserId("012345")).thenReturn(user);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserId("012345");

        UserDto response = service.deleteUser(request);
        verify(repository).delete(user);
        assertEquals("rocket", response.getNickname());
        assertEquals("012345", response.getUserId());
    }

    @Test
    public void deleteNonExistentUser() {
        when(repository.findUserByUserId("012345")).thenReturn(null);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserId("012345");

        ApiException exception = assertThrows(ApiException.class, () -> {
            service.deleteUser(request);
        });

        assertEquals(UserError.NOT_FOUND, exception.getError());
    }
}
