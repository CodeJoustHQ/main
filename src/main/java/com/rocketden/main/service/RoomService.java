package com.rocketden.main.service;

import com.rocketden.main.controller.v1.BaseRestController;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;
    private static final Random random = new Random();
    private static final String SUBSCRIBE_USER_SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user";
    private static final String START_GAME_SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/start-game";

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
        if (room.getUsers().contains(user)) {
            throw new ApiException(RoomError.USER_ALREADY_PRESENT);
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

        Room room = new Room();
        room.setRoomId(generateRoomId());
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
        sendSocketUpdate(roomDto);
        return RoomMapper.toDto(room);
    }

    // Send updates about new users to the client through sockets
    public void sendSocketUpdate(RoomDto roomDto) {
        String socketPath = String.format(SUBSCRIBE_USER_SOCKET_PATH, roomDto.getRoomId());
        template.convertAndSend(socketPath, roomDto);
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
