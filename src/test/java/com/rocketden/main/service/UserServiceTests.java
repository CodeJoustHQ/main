package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.DeleteUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals("rocket", response.getNickname());
    }

    @Test
    public void deleteExistingUser() {
        User user = new User();
        when(repository.findUserByNickname("rocket")).thenReturn(user);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setNickname("rocket");

        boolean response = service.deleteUser(request);
        verify(repository).delete(user);
        assertTrue(response);
    }

    @Test
    public void deleteNonExistingUser() {
        User user = new User();
        when(repository.findUserByNickname("rocket")).thenReturn(null);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setNickname("rocket");

        boolean response = service.deleteUser(request);
        assertFalse(response);
    }
}
