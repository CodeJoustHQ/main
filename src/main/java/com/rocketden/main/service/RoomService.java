package com.rocketden.main.service;

import com.rocketden.main.Utility.Utility;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;

import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.HashSet;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;

    private final RoomRepository repository;
    private final SimpMessagingTemplate template;

    @Autowired
    public RoomService(RoomRepository repository, SimpMessagingTemplate template) {
        this.repository = repository;
        this.template = template;
    }

    public RoomDto joinRoom(JoinRoomRequest request) {
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
        Set<User> users = room.getUsers();
        for (User roomUser : users) {
            if (roomUser.getNickname().equals(user.getNickname())) {
                throw new ApiException(RoomError.USER_WITH_NICKNAME_ALREADY_PRESENT);
            };
        }

        // Add userId if not already present.
        if (user.getUserId() == null) {
            user.setUserId(Utility.generateId(UserService.USER_ID_LENGTH));
        }

        // Add the user to the room.
        room.addUser(user);
        repository.save(room);

        RoomDto roomDto = RoomMapper.toDto(room);
        sendSocketUpdate(roomDto);
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
            host.setUserId(Utility.generateId(UserService.USER_ID_LENGTH));
        }

        // Add the host to a new user set.
        Set<User> users = new HashSet<>();
        users.add(host);

        Room room = new Room();
        room.setRoomId(Utility.generateId(ROOM_ID_LENGTH));
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

    // Send updates about new users to the client through sockets
    public void sendSocketUpdate(RoomDto roomDto) {
        String socketPath = String.format(Utility.SOCKET_PATH, roomDto.getRoomId());
        template.convertAndSend(socketPath, roomDto);
    }
}
