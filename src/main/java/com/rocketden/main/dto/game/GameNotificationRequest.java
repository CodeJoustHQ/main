package com.rocketden.main.dto.game;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.NotificationType;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class GameNotificationRequest {
    private UserDto initiator;
    private NotificationType notificationType;
    private String content;
}
