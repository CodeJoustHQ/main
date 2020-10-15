package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.room.JoinRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.room.UpdateSettingsRequest;
import com.rocketden.main.service.RoomService;
import com.rocketden.main.util.Utility;

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

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable String roomId) {
        return new ResponseEntity<>(service.getRoom(roomId), HttpStatus.OK);
    }

    @PutMapping("/rooms/{roomId}/users")
    public ResponseEntity<RoomDto> joinRoom(@PathVariable String roomId,@RequestBody JoinRoomRequest request) {
        return new ResponseEntity<>(service.joinRoom(roomId, request), HttpStatus.OK);
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

    @PutMapping("/rooms/{roomId}/settings")
    public ResponseEntity<RoomDto> updateRoomSettings(@PathVariable String roomId,
                                                      @RequestBody UpdateSettingsRequest request) {
        return new ResponseEntity<>(service.updateRoomSettings(roomId, request), HttpStatus.OK);
    }
}
