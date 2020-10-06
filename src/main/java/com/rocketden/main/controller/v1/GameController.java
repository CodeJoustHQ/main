package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.room.GetRoomRequest;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.game.StartGameRequest;

import com.rocketden.main.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController extends BaseRestController {

    private final GameService service;

    @Autowired
    public GameController(GameService service) {
        this.service = service;
    }

    @PostMapping("/rooms/{roomId}/start")
    public ResponseEntity<RoomDto> startGame(@RequestBody StartGameRequest request) {
        return new ResponseEntity<>(service.startGame(request), HttpStatus.OK);
    }
}
