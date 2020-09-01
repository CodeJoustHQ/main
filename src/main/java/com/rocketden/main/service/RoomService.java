package com.rocketden.main.service;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    public static final int ROOM_ID_LENGTH = 6;

    public JoinRoomResponse joinRoom(JoinRoomRequest request) {
        return null;
    }

    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        return null;
    }

    protected String generateRoomId() {
        return "";
    }
}
