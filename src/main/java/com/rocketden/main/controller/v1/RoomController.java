package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.CreateRoomResponse;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public JoinRoomResponse joinRoom(@RequestBody JoinRoomRequest request) {
        return service.joinRoom(request);
    }

    @PostMapping("/rooms")
    public CreateRoomResponse createRoom(@RequestBody CreateRoomRequest request) {
        return service.createRoom(request);
    }
}
