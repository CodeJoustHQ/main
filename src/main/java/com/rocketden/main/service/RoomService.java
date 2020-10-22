package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;

    private final RoomRepository repository;
    private final SocketService socketService;
    private final Utility utility;

    @Autowired
    public RoomService(RoomRepository repository, SocketService socketService, Utility utility) {
        this.repository = repository;
        this.socketService = socketService;
        this.utility = utility;
    }

    public RoomDto joinRoom(String roomId, JoinRoomRequest request) {
        Room room = repository.findRoomByRoomId(roomId);

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
            throw new ApiException(RoomError.DUPLICATE_USERNAME);
        }

        // Return error if room is already active.
        if (room.getActive()) {
            throw new ApiException(RoomError.ALREADY_ACTIVE);
        }

        // Add userId if not already present.
        if (user.getUserId() == null) {
            user.setUserId(utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY));
        }

        // Add the user to the room.
        room.addUser(user);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }

    public RoomDto createRoom(CreateRoomRequest request) {
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
            host.setUserId(utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY));
        }

        Room room = new Room();
        room.setRoomId(utility.generateUniqueId(RoomService.ROOM_ID_LENGTH, Utility.ROOM_ID_KEY));
        room.setHost(host);
        room.addUser(host);
        repository.save(room);

        return RoomMapper.toDto(room);
    }

    public RoomDto getRoom(String roomId) {
        Room room = repository.findRoomByRoomId(roomId);

        // Throw an error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        return RoomMapper.toDto(room);
    }

    public RoomDto removeUser(String roomId, String userId) {
        Room room = repository.findRoomByRoomId(roomId);

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        User user = room.getUserByUserId(userId);

        // Return error if user does not exist in room
        if (user == null) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        room.removeUser(user);
        repository.save(room);

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

        User newHost = room.getEquivalentUser(proposedNewHost);

        // Return error if the proposed new host is currently inactive
        if (newHost.getSessionId() == null) {
            throw new ApiException(RoomError.INACTIVE_USER);
        }

        // Change the host to the new user
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

        // Set new difficulty value if not null
        if (request.getDifficulty() != null) {
            room.setDifficulty(request.getDifficulty());
        }
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        socketService.sendSocketUpdate(roomDto);
        return roomDto;
    }
}
