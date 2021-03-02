package com.rocketden.main.dto.game;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.game_object.NotificationType;

import com.rocketden.main.util.InstantDeserializer;
import com.rocketden.main.util.InstantSerializer;
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
