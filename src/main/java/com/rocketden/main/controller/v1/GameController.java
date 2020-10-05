package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.service.RoomService;
import com.rocketden.main.dto.game.StartGameRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<Void> startGame(@RequestBody StartGameRequest request) {
        // Check if current user ID is the host
        GetRoomRequest getRoomRequest = new GetRoomRequest();
        getRoomRequest.setRoomId(request.getRoomId());
        RoomDto roomDto = service.getRoom(getRoomRequest);

        if (!roomDto.getHost().getNickname().equals(request.getUser().getNickname())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        service.startGame(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
