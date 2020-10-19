package com.rocketden.main.service;

import com.rocketden.main.controller.v1.BaseRestController;
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
	private SimpMessagingTemplate template;

	@Spy
	@InjectMocks
	private GameService gameService;

	@Test
	public void startGameSuccess() {
		String roomId = "123456";
		User host = new User();
		host.setNickname("rocket");

		Room room = new Room();
		room.setRoomId(roomId);
		room.setHost(host);

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(UserMapper.toDto(host));

		Mockito.doReturn(room).when(repository).findRoomByRoomId(roomId);
		RoomDto response = gameService.startGame(roomId, request);

		verify(template).convertAndSend(
				eq(String.format(BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user", roomId)),
				eq(response));

		assertEquals(roomId, response.getRoomId());
	}

	@Test
	public void startGameRoomNotFound() {
		UserDto user = new UserDto();
		user.setNickname("rocket");
		String roomId = "123456";

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(user);

		Mockito.doReturn(null).when(repository).findRoomByRoomId(roomId);
		ApiException exception = assertThrows(ApiException.class, () -> gameService.startGame(roomId, request));
		assertEquals(RoomError.NOT_FOUND, exception.getError());
	}

	@Test
	public void startGameWrongInitiator() {
		String roomId = "123456";
		User host = new User();
		host.setNickname("rocket");

		Room room = new Room();
		room.setRoomId(roomId);
		room.setHost(host);

		UserDto initiator = new UserDto();
		initiator.setNickname("rocketrocket");

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(initiator);

		Mockito.doReturn(room).when(repository).findRoomByRoomId(roomId);
		ApiException exception = assertThrows(ApiException.class, () -> gameService.startGame(roomId, request));
		assertEquals(RoomError.INVALID_PERMISSIONS, exception.getError());
	}
}
