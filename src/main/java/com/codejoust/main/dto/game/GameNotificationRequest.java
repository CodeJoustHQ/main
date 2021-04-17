package com.codejoust.main.dto.game;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.game_object.NotificationType;

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
