package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.service.RoomService;
import com.rocketden.main.dto.game.StartGameRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController extends BaseRestController {
    
    private final RoomService service;

    @Autowired
    public GameController(RoomService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public ResponseEntity<RoomDto> startGame(@RequestBody StartGameRequest request) {
        // Check if current user ID is the host
        GetRoomRequest getRoomRequest = new GetRoomRequest();
        getRoomRequest.setRoomId(request.getRoomId());
        RoomDto roomDto = service.getRoom(getRoomRequest);

        if (!roomDto.getHost().equals(request.getUser())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(service.startGame(request), HttpStatus.OK);
    }
}
