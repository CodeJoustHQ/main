package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.HashSet;
import java.util.Random;

@Service
public class RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

    public static final int ROOM_ID_LENGTH = 6;

    private final RoomRepository repository;
    private static final Random random = new Random();

    @Autowired
    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    public JoinRoomResponse joinRoom(JoinRoomRequest request) {
        logger.info("WALNUT");
        logger.info("0");
        Room room = repository.findRoomByRoomId(request.getRoomId());

        logger.info("1");

        // Return error if room could not be found
        if (room == null) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_NOT_FOUND);
            return response;
        }

        logger.info("3");

        // Get the user who initialized the request.
        User user = request.getUser();

        if (user == null) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_NO_USER_FOUND);
            return response;
        }

        logger.info("4");

        // Return error if user is already in the room
        Set<User> users = room.getUsers();
        if (users.contains(user)) {
            JoinRoomResponse response = new JoinRoomResponse();
            response.setMessage(JoinRoomResponse.ERROR_USER_ALREADY_PRESENT);
            return response;
        }

        logger.info("5");
        
        // Add the user to the room.
        users.add(user);
        room.setUsers(users);
        repository.save(room);

        logger.info("6");

        JoinRoomResponse response = RoomMapper.entityToJoinResponse(room);
        response.setMessage(JoinRoomResponse.SUCCESS);
        response.setUsers(users);

        logger.info("7");

        return response;
    }

    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        logger.info("1");
        // Add the host to a new user set.
        Set<User> users = new HashSet<>();
        logger.info("2");
        users.add(request.getHost());
        logger.info("3");

        logger.info(request.getHost().getNickname());

        Room room = new Room();
        room.setRoomId(generateRoomId());
        room.setHost(request.getHost());
        room.setUsers(users);
        repository.save(room);
        logger.info("4");

        CreateRoomResponse response = RoomMapper.entityToCreateResponse(room);
        response.setMessage(CreateRoomResponse.SUCCESS);
        response.setHost(request.getHost());
        logger.info("5");

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
