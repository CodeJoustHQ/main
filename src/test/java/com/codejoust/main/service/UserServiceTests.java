package com.codejoust.main.service;

import com.codejoust.main.util.TestFields;
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

import com.codejoust.main.dao.UserRepository;
import com.codejoust.main.dto.user.CreateUserRequest;
import com.codejoust.main.dto.user.DeleteUserRequest;
import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.exception.UserError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;
import com.codejoust.main.util.Utility;

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
        request.setNickname(TestFields.NICKNAME);
        request.setUserId(TestFields.USER_ID);

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals(TestFields.NICKNAME, response.getNickname());
        assertEquals(TestFields.USER_ID, response.getUserId());
    }

    @Test
    public void createUserNoUserIdSuccess() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(TestFields.NICKNAME);

        Mockito.doReturn(TestFields.USER_ID).when(utility).generateUniqueId(eq(UserService.USER_ID_LENGTH), eq(Utility.USER_ID_KEY));

        UserDto response = service.createUser(request);
        verify(repository).save(Mockito.any(User.class));
        assertEquals(TestFields.NICKNAME, response.getNickname());
        assertEquals(TestFields.USER_ID, response.getUserId());
    }

    @Test
    public void createUserInvalidNickname() {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket rocket");

        ApiException exception = assertThrows(ApiException.class, () -> service.createUser(request));

        assertEquals(UserError.INVALID_USER, exception.getError());
    }

    @Test
    public void deleteExistingUser() {
        User user = new User();
        user.setUserId(TestFields.USER_ID);
        when(repository.findUserByUserId(TestFields.USER_ID)).thenReturn(user);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserToDelete(UserMapper.toDto(user));

        UserDto response = service.deleteUser(request);
        verify(repository).delete(user);
        assertEquals(TestFields.USER_ID, response.getUserId());
    }

    @Test
    public void deleteNonExistentUser() {
        User user = new User();
        user.setUserId(TestFields.USER_ID);
        when(repository.findUserByUserId(TestFields.USER_ID)).thenReturn(null);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserToDelete(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () -> service.deleteUser(request));

        assertEquals(UserError.NOT_FOUND, exception.getError());
    }

    @Test
    public void deleteUserInRoom() {
        User user = new User();
        user.setUserId(TestFields.USER_ID);
        when(repository.findUserByUserId(TestFields.USER_ID)).thenReturn(user);

        Room room = new Room();
        room.addUser(user);

        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserToDelete(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () -> service.deleteUser(request));

        assertEquals(UserError.IN_ROOM, exception.getError());
    }
}
