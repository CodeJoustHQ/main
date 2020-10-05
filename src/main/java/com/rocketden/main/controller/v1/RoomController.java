package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/rooms")
    public ResponseEntity<RoomDto> getRoom(GetRoomRequest request) {
        return new ResponseEntity<>(service.getRoom(request), HttpStatus.OK);
    }

    @PutMapping("/rooms")
    public ResponseEntity<RoomDto> joinRoom(@RequestBody JoinRoomRequest request) {
        return new ResponseEntity<>(service.joinRoom(request), HttpStatus.OK);
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomDto> createRoom(@RequestBody CreateRoomRequest request) {
        return new ResponseEntity<>(service.createRoom(request), HttpStatus.CREATED);
    }

    @PutMapping("/rooms/{roomId}/host")
    public ResponseEntity<RoomDto> updateRoomHost(@PathVariable String roomId,
                                                  @RequestBody UpdateHostRequest request) {
        return new ResponseEntity<>(service.updateRoomHost(roomId, request), HttpStatus.OK);
    }
}
