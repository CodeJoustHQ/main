package com.codejoust.main.controller.v1;

import com.codejoust.main.dto.game.GameDto;
import com.codejoust.main.dto.game.GameNotificationDto;
import com.codejoust.main.dto.game.GameNotificationRequest;
import com.codejoust.main.dto.game.PlayAgainRequest;
import com.codejoust.main.dto.game.StartGameRequest;
import com.codejoust.main.dto.game.SubmissionDto;
import com.codejoust.main.dto.game.SubmissionRequest;
import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.service.GameManagementService;

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
        return new ResponseEntity<>(service.getGameDtoFromRoomId(roomId), HttpStatus.OK);
    }

    @PostMapping("/rooms/{roomId}/start")
    public ResponseEntity<RoomDto> startGame(@PathVariable String roomId,
                                             @RequestBody StartGameRequest request) {
        return new ResponseEntity<>(service.startGame(roomId, request), HttpStatus.OK);
    }

    @PostMapping("/games/{roomId}/notification")
    public ResponseEntity<GameNotificationDto> sendNotification(@PathVariable String roomId, @RequestBody GameNotificationRequest request) {
        return new ResponseEntity<>(service.sendNotification(roomId, new GameNotificationDto(request)), HttpStatus.OK);
    }
    
    @PostMapping("/games/{roomId}/run-code")
    public ResponseEntity<SubmissionDto> runCode(@PathVariable String roomId,
                                                        @RequestBody SubmissionRequest request) {
        return new ResponseEntity<>(service.runCode(roomId, request), HttpStatus.OK);
    }
    
    @PostMapping("/games/{roomId}/submission")
    public ResponseEntity<SubmissionDto> submitSolution(@PathVariable String roomId,
                                                        @RequestBody SubmissionRequest request) {
        return new ResponseEntity<>(service.submitSolution(roomId, request), HttpStatus.OK);
    }

    @PostMapping("/games/{roomId}/restart")
    public ResponseEntity<RoomDto> playAgain(@PathVariable String roomId,
                                                        @RequestBody PlayAgainRequest request) {
        return new ResponseEntity<>(service.playAgain(roomId, request), HttpStatus.OK);
    }
}
