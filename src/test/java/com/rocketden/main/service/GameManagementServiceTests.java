package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class GameManagementServiceTests {

	@Mock
	private RoomRepository repository;

	@Mock
	private SocketService socketService;

	@Mock
	private SimpMessagingTemplate template;

	@Spy
	@InjectMocks
    private GameManagementService gameService;
    
    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String ROOM_ID = "012345";

    @Test
	public void addGetAndRemoveGame() {
    	// Initially, room doesn't exist
		ApiException exception = assertThrows(ApiException.class, () -> gameService.getGameFromRoomId(ROOM_ID));
		assertEquals(GameError.NOT_FOUND, exception.getError());

		Room room = new Room();
		room.setRoomId(ROOM_ID);
		User user = new User();
		user.setNickname(NICKNAME);
		room.addUser(user);

		// Create a game from a room
		gameService.createAddGameFromRoom(room);

		// Check that game has copied over the correct details
		Game game = gameService.getGameFromRoomId(ROOM_ID);
		assertEquals(room, game.getRoom());
		assertEquals(user, game.getPlayers().get(NICKNAME).getUser());

		gameService.removeGame(ROOM_ID);

		// Check that game has been removed
		exception = assertThrows(ApiException.class, () -> gameService.getGameFromRoomId(ROOM_ID));
		assertEquals(GameError.NOT_FOUND, exception.getError());
	}

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
		assertTrue(response.isActive());

		// Game object is created when the room chooses to start
		Game game = gameService.getGameFromRoomId(ROOM_ID);
		assertNotNull(game);
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

	@Test
	public void getGameSuccess() throws Exception {
		// TODO
	}

	@Test
	public void getGameNotFound() throws Exception {
		// TODO
	}
}
