package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.game_object.Game;

import org.springframework.stereotype.Service;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class SubmitService {

    private final SocketService socketService;

    protected SubmitService(SocketService socketService) {
        this.socketService = socketService;
    }

    // Test the submission and send a socket update.
    public SubmissionDto submitSolution(Game game, SubmissionRequest request) {
        return null;
    }

}
