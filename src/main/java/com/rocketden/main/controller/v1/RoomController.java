package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.dto.user.CreateUserResponse;
import com.rocketden.main.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoomController extends BaseRestController {

    private final RoomService service;

    @Autowired
    public RoomController(RoomService service) {
        this.service = service;
    }

    @PutMapping("/rooms")
    public ResponseEntity<JoinRoomResponse> joinRoom(@RequestBody JoinRoomRequest request) {
        JoinRoomResponse response = service.joinRoom(request);

        // Return 404 error if response message is invalid
        if (response.getMessage().equals(JoinRoomResponse.ERROR_NOT_FOUND)) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else if (response.getMessage().equals(JoinRoomResponse.ERROR_USER_ALREADY_PRESENT)) {
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        } else if (response.getMessage().equals(JoinRoomResponse.ERROR_NO_USER_FOUND)) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else if (response.getMessage().equals(CreateUserResponse.ERROR_NO_NICKNAME)) {
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (response.getMessage().equals(CreateUserResponse.ERROR_INVALID_NICKNAME)) {
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/rooms")
    public ResponseEntity<CreateRoomResponse> createRoom(@RequestBody CreateRoomRequest request) {
        CreateRoomResponse response = service.createRoom(request);

        // Return 404 error if response message is invalid
        if (response.getMessage().equals(CreateRoomResponse.ERROR_NO_HOST)) {
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (response.getMessage().equals(CreateUserResponse.ERROR_NO_NICKNAME)) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else if (response.getMessage().equals(CreateUserResponse.ERROR_INVALID_NICKNAME)) {
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
