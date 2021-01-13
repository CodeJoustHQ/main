package com.rocketden.main.dto.game;

import java.time.LocalDateTime;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.NotificationType;

public class GameNotificationDto {
    private UserDto initiator;
    private LocalDateTime time;
    private NotificationType notificationType;
    private String content;
}
