package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.util.Utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;

    private final RoomRepository repository;
    private final SocketService socketService;

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomService.class);

    @Autowired
    public RoomService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }

    public RoomDto joinRoom(JoinRoomRequest request, Utility utility) {
        Room room = repository.findRoomByRoomId(request.getRoomId());

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // Get the user who initialized the request.
        User user = UserMapper.toEntity(request.getUser());

        // Return error if user is invalid or not provided
        if (user == null || !UserService.validNickname(user.getNickname())) {
            throw new ApiException(UserError.INVALID_USER);
        }

        // Return error if a user with the same nickname is in the room.
        if (room.containsUserWithNickname(user.getNickname())) {
            throw new ApiException(RoomError.USER_WITH_NICKNAME_ALREADY_PRESENT);
        }

        // Add userId if not already present.
        if (user.getUserId() == null) {
            user.setUserId(utility.generateId(UserService.USER_ID_LENGTH));
        }

        // Add the user to the room.
        room.addUser(user);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        LOGGER.info("dinosaur");
        LOGGER.info("" + socketService);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    public RoomDto createRoom(CreateRoomRequest request, Utility utility) {
        User host = UserMapper.toEntity(request.getHost());

        // Do not create room if provided host is invalid.
        if (host == null) {
            throw new ApiException(RoomError.NO_HOST);
        }
        if (!UserService.validNickname(host.getNickname())) {
            throw new ApiException(UserError.INVALID_USER);
        }

        // Create user ID for the host if not already present.
        if (host.getUserId() == null) {
            host.setUserId(utility.generateId(UserService.USER_ID_LENGTH));
        }

        // Add the host to a new user list.
        List<User> users = new ArrayList<>();
        users.add(host);

        Room room = new Room();
        room.setRoomId(utility.generateId(ROOM_ID_LENGTH));
        room.setHost(host);
        room.addUser(host);
        repository.save(room);

        return RoomMapper.toDto(room);
    }

    public RoomDto getRoom(GetRoomRequest request) {
        Room room = repository.findRoomByRoomId(request.getRoomId());

        // Throw an error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        return RoomMapper.toDto(room);
    }

    public RoomDto updateRoomHost(String roomId, UpdateHostRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // Get the initiator and proposed new host from the request
        User initiator = UserMapper.toEntity(request.getInitiator());
        User proposedNewHost = UserMapper.toEntity(request.getNewHost());

        // Return error if the initiator is not the host
        if (!room.getHost().equals(initiator)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Return error if the proposed new host is not in the room
        if (!room.getUsers().contains(proposedNewHost)) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        // Change the host to the new user
        User newHost = room.getEquivalentUser(proposedNewHost);
        room.setHost(newHost);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    public RoomDto updateRoomSettings(String roomId, UpdateSettingsRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        // Return error if the initiator is not the host
        User initiator = UserMapper.toEntity(request.getInitiator());
        if (!room.getHost().equals(initiator)) {
            throw new ApiException(RoomError.INVALID_PERMISSIONS);
        }

        // Set new difficulty value
        room.setDifficulty(request.getDifficulty());
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }
}
