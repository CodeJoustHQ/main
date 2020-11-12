package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameService {

    private final RoomRepository repository;
	private final SocketService socketService;

    @Autowired
    public GameService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }

	// Set room's active state to true
	public RoomDto startGame(String roomId, StartGameRequest request) {
		Room room = repository.findRoomByRoomId(roomId);

		// If requested room does not exist in database, throw an exception.
		if (room == null) {
			throw new ApiException(RoomError.NOT_FOUND);
		}

		// if user making request is not the host, throw an exception.
		if (!request.getInitiator().getNickname().equals(room.getHost().getNickname())) {
			throw new ApiException(RoomError.INVALID_PERMISSIONS);
		}

		room.setActive(true);
		repository.save(room);

		RoomDto roomDto = RoomMapper.toDto(room);
		socketService.sendSocketUpdate(roomDto);
		return roomDto;
	}
}
