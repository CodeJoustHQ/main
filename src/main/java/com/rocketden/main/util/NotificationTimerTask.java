package com.rocketden.main.util;

import java.time.LocalDateTime;
import java.util.TimerTask;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.GameNotificationDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.TimerError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.NotificationType;
import com.rocketden.main.service.SocketService;

public class NotificationTimerTask extends TimerTask {

    private Game game;

    private String timeRemaining;

    private final SocketService socketService;

    public NotificationTimerTask(SocketService socketService, Game game,
        String timeRemaining) {
        this.socketService = socketService;
        this.game = game;
        this.timeRemaining = timeRemaining;

        // Handle potential errors for run().
        if (game == null || game.getGameTimer() == null || game.getRoom() == null || game.getRoom().getRoomId() == null || socketService == null) {
            throw new ApiException(TimerError.NULL_SETTING);
        }
    }

	@Override
    public void run() {
        GameNotificationDto notificationDto = new GameNotificationDto();
        notificationDto.setInitiator(null);
        notificationDto.setNotificationType(NotificationType.TIME_LEFT);
        notificationDto.setTime(LocalDateTime.now());
        notificationDto.setContent(timeRemaining);


        // Get the Game DTO and send the relevant socket update.
        socketService.sendSocketUpdate(GameMapper.toDto(game));
    }
    
}
