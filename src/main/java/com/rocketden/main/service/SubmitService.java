package com.rocketden.main.service;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.game_object.Player;
import com.rocketden.main.model.problem.Problem;

import org.springframework.stereotype.Service;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class SubmitService {

    private final RoomRepository repository;
    private final SocketService socketService;

    protected SubmitService(RoomRepository repository, SocketService socketService) {
        this.repository = repository;
        this.socketService = socketService;
    }

    // Test the submission and return a socket update.
    public GameDto testSubmission(Player player, Problem problem) {
        return new GameDto();
    }

}
