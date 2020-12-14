package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.game.StartGameRequest;

import com.rocketden.main.service.GameManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController extends BaseRestController {

    private final GameManagementService service;

    @Autowired
    public GameController(GameManagementService service) {
        this.service = service;
    }

    @GetMapping("/games/{roomId}")
    public ResponseEntity<GameDto> getGame(@PathVariable String roomId) {
        return new ResponseEntity<>(service.getGameDto(roomId), HttpStatus.OK);
    }

    @PostMapping("/rooms/{roomId}/start")
    public ResponseEntity<RoomDto> startGame(@PathVariable String roomId,
                                             @RequestBody StartGameRequest request) {
        return new ResponseEntity<>(service.startGame(roomId, request), HttpStatus.OK);
    }
}
