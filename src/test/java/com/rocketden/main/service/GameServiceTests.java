package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class GameServiceTests {

	@Mock
	private RoomRepository repository;

	@Mock
	private SocketService socketService;

	@Mock
	private SimpMessagingTemplate template;

	@Spy
	@InjectMocks
    private GameService gameService;
    
    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String ROOM_ID = "012345";

	@Test
	public void startGameSuccess() {
		User host = new User();
		host.setNickname(NICKNAME);

		Room room = new Room();
		room.setRoomId(ROOM_ID);
		room.setHost(host);

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(UserMapper.toDto(host));

		Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
		RoomDto response = gameService.startGame(ROOM_ID, request);

		verify(socketService).sendSocketUpdate(eq(response));

		assertEquals(ROOM_ID, response.getRoomId());
		assertEquals(true, response.isActive());
	}

	@Test
	public void startGameRoomNotFound() {
		UserDto user = new UserDto();
		user.setNickname(NICKNAME);

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(user);

		Mockito.doReturn(null).when(repository).findRoomByRoomId(ROOM_ID);
		ApiException exception = assertThrows(ApiException.class, () -> gameService.startGame(ROOM_ID, request));
		assertEquals(RoomError.NOT_FOUND, exception.getError());
	}

	@Test
	public void startGameWrongInitiator() {
		User host = new User();
		host.setNickname(NICKNAME);

		Room room = new Room();
		room.setRoomId(ROOM_ID);
		room.setHost(host);

		UserDto initiator = new UserDto();
		initiator.setNickname(NICKNAME_2);

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(initiator);

		Mockito.doReturn(room).when(repository).findRoomByRoomId(ROOM_ID);
		ApiException exception = assertThrows(ApiException.class, () -> gameService.startGame(ROOM_ID, request));
		assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
	}
}
