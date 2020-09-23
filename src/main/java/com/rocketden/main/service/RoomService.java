package com.rocketden.main.service;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;

import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.GetRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.UserDto;
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
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;
    private static final Random random = new Random();
    private static final String SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user";

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

        // Return error if user is already in the room
        Set<User> users = room.getUsers();
        if (users.contains(user)) {
            throw new ApiException(RoomError.USER_ALREADY_PRESENT);
        }

        // Add the user to the room.
        users.add(user);
        room.setUsers(users);
        repository.save(room);

        sendSocketUpdate(room.getRoomId(), room.getUsers());
        return RoomMapper.toDto(room);
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

        // Add the host to a new user set.
        Set<User> users = new HashSet<>();
        users.add(host);

        Room room = new Room();
        room.setRoomId(generateRoomId());
        room.setHost(host);
        room.setUsers(users);
        repository.save(room);

        return RoomMapper.toDto(room);
    }

    public GetRoomResponse getRoom(GetRoomRequest request) {
        Room room = repository.findRoomByRoomId(request.getRoomId());

        // Throw an error if room could not be found
        if (room == null) {
            throw new ApiException(RoomError.NOT_FOUND);
        }

        return RoomMapper.entityToGetResponse(room);
    }

    // Send updates about new users to the client through sockets
    public void sendSocketUpdate(String roomId, Set<User> users) {
        Set<UserDto> userDtos = users.stream().map(UserMapper::toDto).collect(Collectors.toSet());
        String socketPath = String.format(SOCKET_PATH, roomId);
        template.convertAndSend(socketPath, userDtos);
    }

    // Generate numeric String with length ROOM_ID_LENGTH
    protected String generateRoomId() {
        String numbers = "1234567890";
        char[] values = new char[ROOM_ID_LENGTH];

        for (int i = 0; i < values.length; i++) {
            int index = random.nextInt(numbers.length());
            values[i] = numbers.charAt(index);
        }

        return new String(values);
    }
}
