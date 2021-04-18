package com.codejoust.main.util;

import java.util.TimerTask;

import com.codejoust.main.dto.game.GameDto;
import com.codejoust.main.dto.game.GameMapper;
import com.codejoust.main.exception.TimerError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.Game;
import com.codejoust.main.service.SocketService;

public class EndGameTimerTask extends TimerTask {

    private final Game game;

    private final SocketService socketService;

    public EndGameTimerTask(SocketService socketService, Game game) {
        this.socketService = socketService;
        this.game = game;

        // Handle potential errors for run().
        if (game == null || game.getGameTimer() == null || game.getRoom() == null || game.getRoom().getRoomId() == null || socketService == null) {
            throw new ApiException(TimerError.NULL_SETTING);
        }
    }

	@Override
    public void run() {
        // Set time as up.
        game.getGameTimer().setTimeUp(true);

        // Get the Game DTO and send the relevant socket update.
        GameDto gameDto = GameMapper.toDto(game);
        socketService.sendSocketUpdate(gameDto);
    }
    
}
