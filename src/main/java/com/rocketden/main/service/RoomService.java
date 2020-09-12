package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.user.CreateUserResponse;
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
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_NOT_FOUND);
            return response;
        }

        // Get the user who initialized the request.
        User user = request.getUser();

        // Return error if user is invalid or not provided
        if (user == null) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_NO_USER_FOUND);
            return response;
        } else if (UserService.validNickname(user.getNickname())) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(CreateUserResponse.ERROR_INVALID_NICKNAME);
            return response;
        }

        // Return error if user is already in the room
        Set<User> users = room.getUsers();
        if (users.contains(user)) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_USER_ALREADY_PRESENT);
            return response;
        }

        // Add the user to the room.
        users.add(user);
        room.setUsers(users);
        repository.save(room);

        JoinRoomResponse response = RoomMapper.entityToJoinResponse(room);
        response.setMessage(JoinRoomResponse.SUCCESS);
        response.setUsers(users);

        return response;
    }

    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        User host = request.getHost();

        // Do not create room if provided host is invalid.
        if (host == null) {
            CreateRoomResponse response = new CreateRoomResponse();
            response.setMessage(CreateRoomResponse.ERROR_NO_HOST);
            return response;
        } else if (host.getNickname() == null) {
            CreateRoomResponse response = new CreateRoomResponse();
            response.setMessage(CreateUserResponse.ERROR_NO_NICKNAME);
            return response;
        } else if (UserService.validNickname(host.getNickname())) {
            CreateRoomResponse response = new CreateRoomResponse();
            response.setMessage(CreateUserResponse.ERROR_INVALID_NICKNAME);
            return response;
        }

        // Add the host to a new user set.
        Set<User> users = new HashSet<>();
        users.add(request.getHost());

        Room room = new Room();
        room.setRoomId(generateRoomId());
        room.setHost(request.getHost());
        room.setUsers(users);
        repository.save(room);

        CreateRoomResponse response = RoomMapper.entityToCreateResponse(room);
        response.setMessage(CreateRoomResponse.SUCCESS);
        response.setHost(request.getHost());

        return response;
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
