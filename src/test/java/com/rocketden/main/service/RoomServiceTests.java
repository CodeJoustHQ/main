package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.DeleteRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.room.RemoveUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.TimerError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.Room;

import com.rocketden.main.model.User;
import com.rocketden.main.util.Utility;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.stream.Collectors;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTests {

    @Mock
    private RoomRepository repository;

    @Mock
    private SocketService socketService;

    @Mock
    private Utility utility;

    @Spy
    @InjectMocks
    private RoomService roomService;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String NICKNAME_3 = "rocketandrocket";
    private static final String NICKNAME_4 = "rocketrocketrocket";
    private static final String NICKNAME_5 = "rocketandrocketrocket";
    private static final String SESSION_ID = "abcdef";
    private static final String SESSION_ID_2 = "ghijkl";
    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "678910";
    private static final String USER_ID_2 = "123456";
    private static final String USER_ID_3 = "024681";
    private static final long DURATION = 600;

    @Test
    public void createRoomSuccess() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME);
        CreateRoomRequest request = new CreateRoomRequest();
        request.setHost(user);
        
        // Mock generateUniqueId to return a custom room id
        Mockito.doReturn(ROOM_ID).when(utility).generateUniqueId(eq(RoomService.ROOM_ID_LENGTH), eq(Utility.ROOM_ID_KEY));

        // Mock generateUniqueId to return a custom user id
        Mockito.doReturn(USER_ID).when(utility).generateUniqueId(eq(UserService.USER_ID_LENGTH), eq(Utility.USER_ID_KEY));

        // Verify create room request succeeds and returns correct response
        RoomDto response = roomService.createRoom(request);

        verify(repository).save(Mockito.any(Room.class));
        assertEquals(ROOM_ID, response.getRoomId());
        assertEquals(user.getNickname(), response.getHost().getNickname());
        assertEquals(USER_ID, response.getHost().getUserId());
        assertEquals(ProblemDifficulty.RANDOM, response.getDifficulty());
    }

    @Test
    public void joinRoomSuccess() {
        // Verify join room request succeeds and returns correct response
        User user = new User();
        user.setNickname(NICKNAME);
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(user));

        // Mock generateUniqueId to return a custom user id
        Mockito.doReturn(USER_ID).when(utility).generateUniqueId(eq(UserService.USER_ID_LENGTH), eq(Utility.USER_ID_KEY));

        Room room = new Room();
        room.setRoomId(ROOM_ID);

        // Create host
        User host = new User();
        host.setNickname(NICKNAME_2);
        room.addUser(host);
        room.setHost(host);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        RoomDto response = roomService.joinRoom(ROOM_ID, request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(ROOM_ID, response.getRoomId());
        assertEquals(2, response.getUsers().size());
        assertEquals(host.getNickname(), response.getUsers().get(0).getNickname());
        assertEquals(user.getNickname(), response.getUsers().get(1).getNickname());
        assertEquals(USER_ID, response.getUsers().get(1).getUserId());
        assertEquals(ProblemDifficulty.RANDOM, response.getDifficulty());
    }

    @Test
    public void joinRoomNonexistentFailure() {
        // Verify join room request fails when room does not exist
        User user = new User();
        user.setNickname(NICKNAME);
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(UserMapper.toDto(user));

        // Mock repository to return room when called
        Mockito.doReturn(null).when(repository).findRoomByRoomId(eq(ROOM_ID));

        // Assert that service.joinRoom(request) throws the correct exception
        ApiException exception = assertThrows(ApiException.class, () -> roomService.joinRoom(ROOM_ID, request));

        verify(repository).findRoomByRoomId(ROOM_ID);
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void joinRoomDuplicateUserFailure() {
        /**
         * Verify join room request fails when user with same features 
         * is already present
         * Define two identical, and make the first one the host and 
         * second one the joiner
         */
        User firstUser = new User();
        firstUser.setNickname(NICKNAME);
        UserDto newUser = new UserDto();
        newUser.setNickname(NICKNAME);

        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(newUser);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(firstUser);
        room.addUser(firstUser);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        ApiException exception = assertThrows(ApiException.class, () -> roomService.joinRoom(ROOM_ID, request));

        verify(repository).findRoomByRoomId(ROOM_ID);
        assertEquals(RoomError.DUPLICATE_USERNAME, exception.getError());
    }

    @Test
    public void setRoomSizeFailure() {
        /**
         * Verify set room size request fails when the size to be set is less
         * than the the number of users already in the room
         * Define four users, add to the room, and attempt to set room size to 3
         */
        User firstUser = new User();
        firstUser.setNickname(NICKNAME);
        User secondUser = new User();
        secondUser.setNickname(NICKNAME_2);
        User thirdUser = new User();
        thirdUser.setNickname(NICKNAME_3);
        User fourthUser = new User();
        fourthUser.setNickname(NICKNAME_4);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setSize(4);
        room.setHost(firstUser);
        room.addUser(firstUser);
        
        room.addUser(secondUser);
        room.addUser(thirdUser);
        room.addUser(fourthUser);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(firstUser));
        request.setDifficulty(ProblemDifficulty.EASY);
        request.setDuration(DURATION);
        request.setSize(3);

        ApiException exception = assertThrows(ApiException.class, () -> roomService.updateRoomSettings(ROOM_ID, request));
        assertEquals(RoomError.BAD_ROOM_SIZE, exception.getError());
        verify(repository).findRoomByRoomId(ROOM_ID);
    }

    @Test
    public void joinFullRoomFailure() {
        /**
         * Verify join room request fails when the room is already full
         * Define five users, and add to the room
         */
        User firstUser = new User();
        firstUser.setNickname(NICKNAME);
        User secondUser = new User();
        secondUser.setNickname(NICKNAME_2);
        User thirdUser = new User();
        thirdUser.setNickname(NICKNAME_3);
        User fourthUser = new User();
        fourthUser.setNickname(NICKNAME_4);
        UserDto fifthUser = new UserDto();
        fifthUser.setNickname(NICKNAME_5);

        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(fifthUser);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setSize(4);
        room.setHost(firstUser);
        room.addUser(firstUser);
        
        room.addUser(secondUser);
        room.addUser(thirdUser);
        room.addUser(fourthUser);

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        ApiException exception = assertThrows(ApiException.class, () -> roomService.joinRoom(ROOM_ID, request));

        verify(repository).findRoomByRoomId(ROOM_ID);
        assertEquals(RoomError.ALREADY_FULL, exception.getError());
    }


    @Test
    public void manyUsersJoiningAnInfinitelySizedRoomSuccess() {
        /**
         * Verify join room request works when the room is infinitely sized
         * Define a hundred users, add to the room, then request to add another user
         */
        User firstUser = new User();
        firstUser.setNickname(NICKNAME);
        UserDto secondUser = new UserDto();
        secondUser.setNickname(NICKNAME_2);
        JoinRoomRequest request = new JoinRoomRequest();
        request.setUser(secondUser);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setSize((int) (RoomService.MAX_SIZE + 1));
        room.setHost(firstUser);
        room.addUser(firstUser);

        for (int i = 0; i < 100; i++) {
            User temp = new User();
            temp.setNickname("Rocket" + i);
            room.addUser(temp);
        }

        // Mock repository to return room when called
        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        assertDoesNotThrow(() -> roomService.joinRoom(ROOM_ID, request));
        verify(repository).findRoomByRoomId(ROOM_ID);

        assertEquals(102, room.getUsers().size());
    }

    
    @Test
    public void getRoomSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));
        RoomDto response = roomService.getRoom(ROOM_ID);

        assertEquals(ROOM_ID, response.getRoomId());
        assertEquals(room.getHost(), UserMapper.toEntity(response.getHost()));

        List<User> actual = response.getUsers().stream()
                .map(UserMapper::toEntity).collect(Collectors.toList());
        assertEquals(room.getUsers(), actual);
    }

    @Test
    public void getRoomFailure() {
        ApiException exception = assertThrows(ApiException.class, () -> roomService.getRoom(ROOM_ID));

        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void changeRoomHostSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setSessionId(SESSION_ID);

        User user =  new User();
        user.setNickname(NICKNAME_2);
        user.setSessionId(SESSION_ID_2);

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateHostRequest request = new UpdateHostRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setNewHost(UserMapper.toDto(user));

        RoomDto response = roomService.updateRoomHost(room.getRoomId(), request, false);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(user, UserMapper.toEntity(response.getHost()));
    }

    @Test
    public void changeRoomHostFailure() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setSessionId(SESSION_ID);

        User user =  new User();
        user.setNickname(NICKNAME_2);
        user.setSessionId(SESSION_ID_2);

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        // Invalid permissions
        UpdateHostRequest invalidPermRequest = new UpdateHostRequest();
        invalidPermRequest.setInitiator(UserMapper.toDto(user));
        invalidPermRequest.setNewHost(UserMapper.toDto(host));

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost(ROOM_ID, invalidPermRequest, false));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());

        // Nonexistent room
        UpdateHostRequest noRoomRequest = new UpdateHostRequest();
        noRoomRequest.setInitiator(UserMapper.toDto(host));
        noRoomRequest.setNewHost(UserMapper.toDto(user));

        exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost("999999", noRoomRequest, false));
        assertEquals(RoomError.NOT_FOUND, exception.getError());

        // Nonexistent new host
        UpdateHostRequest noUserRequest = new UpdateHostRequest();
        noUserRequest.setInitiator(UserMapper.toDto(host));

        UserDto nonExistentUser = new UserDto();
        nonExistentUser.setNickname(NICKNAME_3);
        noUserRequest.setNewHost(nonExistentUser);

        exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost(ROOM_ID, noUserRequest, false));
        assertEquals(UserError.NOT_FOUND, exception.getError());

        // New host inactive
        UpdateHostRequest inactiveUserRequest = new UpdateHostRequest();
        user.setSessionId(null);
        inactiveUserRequest.setInitiator(UserMapper.toDto(host));
        inactiveUserRequest.setNewHost(UserMapper.toDto(user));

        exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomHost(ROOM_ID, inactiveUserRequest, false));
        assertEquals(RoomError.INACTIVE_USER, exception.getError());
    }

    @Test
    public void updateRoomSettingsSuccess() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setDifficulty(ProblemDifficulty.EASY);
        request.setDuration(DURATION);
        request.setSize(5);
        request.setNumProblems(3);

        RoomDto response = roomService.updateRoomSettings(room.getRoomId(), request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(request.getDifficulty(), response.getDifficulty());
        assertEquals(request.getDuration(), response.getDuration());
        assertEquals(request.getSize(), response.getSize());
        assertEquals(request.getNumProblems(), response.getNumProblems());
    }

    @Test
    public void updateRoomSettingsInvalidPermissions() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        User user =  new User();
        user.setNickname(NICKNAME_2);

        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        // Invalid permissions
        UpdateSettingsRequest invalidPermRequest = new UpdateSettingsRequest();
        invalidPermRequest.setInitiator(UserMapper.toDto(user));
        invalidPermRequest.setDifficulty(ProblemDifficulty.MEDIUM);

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomSettings(ROOM_ID, invalidPermRequest));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void updateRoomSettingsNoRoomFound() {
        UserDto userDto = new UserDto();
        userDto.setNickname(NICKNAME);

        // Non-existent room
        UpdateSettingsRequest noRoomRequest = new UpdateSettingsRequest();
        noRoomRequest.setInitiator(userDto);
        noRoomRequest.setDifficulty(ProblemDifficulty.HARD);

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomSettings("999999", noRoomRequest));
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void updateRoomSettingsInvalidDuration() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setDifficulty(ProblemDifficulty.EASY);
        request.setDuration(-1L);

        ApiException exception = assertThrows(ApiException.class, () -> roomService.updateRoomSettings(ROOM_ID, request));
        assertEquals(TimerError.INVALID_DURATION, exception.getError());
    }

    @Test
    public void updateRoomSettingsDurationTooLong() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));

        request.setDifficulty(ProblemDifficulty.EASY);
        request.setDuration(RoomService.MAX_DURATION + 1);

        ApiException exception = assertThrows(ApiException.class, () -> roomService.updateRoomSettings(ROOM_ID, request));
        assertEquals(TimerError.INVALID_DURATION, exception.getError());
    }

    @Test
    public void updateRoomSettingsBadNumProblems() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setNumProblems(-1);

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomSettings(ROOM_ID, request));
        assertEquals(ProblemError.INVALID_NUMBER_REQUEST, exception.getError());
    }

    @Test
    public void updateRoomSettingsExceedsMaxProblems() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        UpdateSettingsRequest request = new UpdateSettingsRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setNumProblems(RoomService.MAX_NUM_PROBLEMS + 1);

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.updateRoomSettings(ROOM_ID, request));
        assertEquals(ProblemError.INVALID_NUMBER_REQUEST, exception.getError());
    }

    @Test
    public void removeUserSuccessHostInitiator() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        room.setHost(host);
        room.addUser(host);

        User user = new User();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setUserToDelete(UserMapper.toDto(user));
        RoomDto response = roomService.removeUser(ROOM_ID, request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(1, response.getUsers().size());
        assertFalse(response.getUsers().contains(UserMapper.toDto(user)));
    }

    @Test
    public void removeUserSuccessSelfInitiator() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        room.setHost(host);
        room.addUser(host);

        User user = new User();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(UserMapper.toDto(user));
        request.setUserToDelete(UserMapper.toDto(user));
        RoomDto response = roomService.removeUser(ROOM_ID, request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(1, response.getUsers().size());
        assertFalse(response.getUsers().contains(UserMapper.toDto(user)));
    }

    @Test
    public void removeHost() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);
        host.setSessionId(SESSION_ID);

        room.setHost(host);
        room.addUser(host);

        User user = new User();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        user.setSessionId(SESSION_ID_2);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setUserToDelete(UserMapper.toDto(host));
        RoomDto response = roomService.removeUser(ROOM_ID, request);

        verify(socketService).sendSocketUpdate(eq(response));
        assertEquals(1, response.getUsers().size());
        assertEquals(UserMapper.toDto(user), response.getHost());
        assertFalse(response.getUsers().contains(UserMapper.toDto(host)));
    }

    @Test
    public void removeNonExistentUser() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        room.setHost(host);
        room.addUser(host);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        User user = new User();
        user.setUserId(USER_ID_2);

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setUserToDelete(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.removeUser(ROOM_ID, request));
        assertEquals(UserError.NOT_FOUND, exception.getError());
    }

    @Test
    public void removeUserBadHost() {
        Room room = new Room();
        room.setRoomId(ROOM_ID);

        User host = new User();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        room.setHost(host);
        room.addUser(host);

        User user = new User();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        room.addUser(user);

        User user2 = new User();
        user2.setNickname(NICKNAME_2);
        user2.setUserId(USER_ID_3);
        room.addUser(user2);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(UserMapper.toDto(user));
        request.setUserToDelete(UserMapper.toDto(user2));

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.removeUser(ROOM_ID, request));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
    }

    @Test
    public void removeUserRoomNotFound() {
        User host = new User();
        host.setUserId(USER_ID);

        User user = new User();
        user.setUserId(USER_ID_2);

        Mockito.doReturn(null).when(repository).findRoomByRoomId(eq(ROOM_ID));

        RemoveUserRequest request = new RemoveUserRequest();
        request.setInitiator(UserMapper.toDto(host));
        request.setUserToDelete(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.removeUser(ROOM_ID, request));
        assertEquals(RoomError.NOT_FOUND, exception.getError());
    }

    @Test
    public void conditionallyUpdateRoomHostSuccess() {
        User user1 = new User();
        user1.setUserId(USER_ID);
        user1.setSessionId(SESSION_ID);

        User user2 = new User();
        user2.setUserId(USER_ID_2);

        User user3 = new User();
        user3.setSessionId(USER_ID_3);
        user3.setSessionId(SESSION_ID_2);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(user1);
        room.addUser(user1);
        room.addUser(user2);
        room.addUser(user3);

        // Passing in a non-host user has no effect on the room
        roomService.conditionallyUpdateRoomHost(room, user2, false);
        assertEquals(user1, room.getHost());

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(room.getRoomId()));

        // Passing in the host will assign the first active user to be the new host
        roomService.conditionallyUpdateRoomHost(room, user1, false);
        assertEquals(user3, room.getHost());

        verify(repository).save(room);
    }

    @Test
    public void deleteRoomSuccess() {
        User host = new User();
        host.setUserId(USER_ID);
        host.setSessionId(SESSION_ID);

        User user = new User();
        user.setUserId(USER_ID_2);
        user.setSessionId(SESSION_ID_2);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        DeleteRoomRequest deleteRoomRequest = new DeleteRoomRequest();
        deleteRoomRequest.setHost(UserMapper.toDto(host));
        roomService.deleteRoom(ROOM_ID, deleteRoomRequest);
        verify(repository).delete(eq(room));
    }

    @Test
    public void deleteRoomBadHost() {
        User host = new User();
        host.setUserId(USER_ID);
        host.setSessionId(SESSION_ID);

        User user = new User();
        user.setUserId(USER_ID_2);
        user.setSessionId(SESSION_ID_2);

        Room room = new Room();
        room.setRoomId(ROOM_ID);
        room.setHost(host);
        room.addUser(host);
        room.addUser(user);

        Mockito.doReturn(room).when(repository).findRoomByRoomId(eq(ROOM_ID));

        DeleteRoomRequest deleteRoomRequest = new DeleteRoomRequest();
        deleteRoomRequest.setHost(UserMapper.toDto(user));

        ApiException exception = assertThrows(ApiException.class, () ->
                roomService.deleteRoom(ROOM_ID, deleteRoomRequest));
        assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
        assertNotNull(roomService.getRoom(ROOM_ID));
    }
}
