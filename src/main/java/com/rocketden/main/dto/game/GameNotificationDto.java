package com.rocketden.main.dto.game;

import java.time.Instant;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.NotificationType;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class GameNotificationDto {
    private UserDto initiator;

    private Instant time;

    private NotificationType notificationType;
    private String content;

    public GameNotificationDto() {}
    
    public GameNotificationDto(GameNotificationRequest request) {
        this.initiator = request.getInitiator();
        this.time = Instant.now();
        this.notificationType = request.getNotificationType();
        this.content = request.getContent();
    }
}
