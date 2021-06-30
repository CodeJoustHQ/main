package com.codejoust.main.task;

import java.util.TimerTask;

import com.codejoust.main.exception.TimerError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.Game;
import com.codejoust.main.service.GameManagementService;

public class CreateGameReportTask extends TimerTask {

    private final Game game;

    private final GameManagementService gameManagementService;
    
    public CreateGameReportTask(GameManagementService gameManagementService, Game game) {
        this.gameManagementService = gameManagementService;
        this.game = game;

        // Handle potential errors for run().
        if (game == null) {
            throw new ApiException(TimerError.NULL_SETTING);
        }
    }

	@Override
    public void run() {
        // Create the game report (is the game updated here?).
        gameManagementService.createGameReport(game);
    }
    
}
