package com.rocketden.main.dto.game;

import java.time.LocalDateTime;

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

    @EqualsAndHashCode.Exclude
    private LocalDateTime time;

    private NotificationType notificationType;
    private String content;
}
