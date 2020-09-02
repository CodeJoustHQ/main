package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomMapper;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomMapper;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;

    private final RoomRepository repository;

    @Autowired
    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    public JoinRoomResponse joinRoom(JoinRoomRequest request) {
        Room room = repository.findRoomByRoomId(request.getRoomId());

        // Return error if room could not be found
        if (room == null) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_NOT_FOUND);
            return response;
        }

        JoinRoomResponse response = JoinRoomMapper.entityToResponse(room);
        response.setMessage(JoinRoomResponse.SUCCESS);
        response.setPlayerName(request.getPlayerName());

        return response;
    }

    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        Room room = new Room();
        room.setRoomId(generateRoomId());
        repository.save(room);

        CreateRoomResponse response = CreateRoomMapper.entityToResponse(room);
        response.setMessage(CreateRoomResponse.SUCCESS);

        return response;
    }

    protected String generateRoomId() {
        return "";
    }
}
