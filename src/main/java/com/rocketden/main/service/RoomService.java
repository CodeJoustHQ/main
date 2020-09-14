package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.exception.RoomErrors;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.HashSet;
import java.util.Random;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;

    private final RoomRepository repository;
    private static final Random random = new Random();

    @Autowired
    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    public JoinRoomResponse joinRoom(JoinRoomRequest request) {
        Room room = repository.findRoomByRoomId(request.getRoomId());

        // Return error if room could not be found
        if (room == null) {
            throw new ApiException(RoomErrors.ROOM_NOT_FOUND);
        }

        // Get the user who initialized the request.
        User user = request.getUser();

        // Return error if user is invalid or not provided
        if (user == null || !UserService.validNickname(user.getNickname())) {
            throw new ApiException(UserErrors.INVALID_USER);
        }

        // Return error if user is already in the room
        Set<User> users = room.getUsers();
        if (users.contains(user)) {
            throw new ApiException(RoomErrors.USER_ALREADY_PRESENT);
        }

        // Add the user to the room.
        users.add(user);
        room.setUsers(users);
        repository.save(room);

        return RoomMapper.entityToJoinResponse(room);
    }

    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        User host = request.getHost();

        // Do not create room if provided host is invalid.
        if (host == null) {
            throw new ApiException(RoomErrors.NO_HOST);
        }
        if (!UserService.validNickname(host.getNickname())) {
            throw new ApiException(UserErrors.INVALID_USER);
        }

        // Add the host to a new user set.
        Set<User> users = new HashSet<>();
        users.add(request.getHost());

        Room room = new Room();
        room.setRoomId(generateRoomId());
        room.setHost(request.getHost());
        room.setUsers(users);
        repository.save(room);

        return RoomMapper.entityToCreateResponse(room);
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
