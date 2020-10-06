package com.rocketden.main.service;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class GameService {

	private static final String START_GAME_SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/start-game";

	private final RoomRepository repository;
	private final SimpMessagingTemplate template;

	@Autowired
	public GameService(RoomRepository repository, SimpMessagingTemplate template) {
		this.repository = repository;
		this.template = template;
	}

	// Send request to redirect users to game when host clicks start
	public RoomDto startGame(StartGameRequest request) {
		String socketPath = String.format(START_GAME_SOCKET_PATH, request.getRoomId());
		template.convertAndSend(socketPath, request.getRoomId());

		Room room = repository.findRoomByRoomId(request.getRoomId());

		// If requested room does not exist in database, throw an exception.
		if (room == null) {
			throw new ApiException(RoomError.NOT_FOUND);
		}

		// if user making request is not the host, throw an exception.
		if (request.getUser().getNickname() != room.getHost().getNickname()) {
			throw new ApiException(UserError.ACCESS_DENIED);
		}

		return RoomMapper.toDto(room);
	}
}
