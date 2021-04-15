package com.codejoust.main.dto.game;

import java.time.Instant;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.game_object.NotificationType;
import com.codejoust.main.util.InstantDeserializer;
import com.codejoust.main.util.InstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class GameNotificationDto {
    private UserDto initiator;

    @JsonSerialize(using = InstantSerializer.class)
    @JsonDeserialize(using = InstantDeserializer.class)
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
