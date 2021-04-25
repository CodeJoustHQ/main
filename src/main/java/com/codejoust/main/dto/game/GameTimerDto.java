package com.codejoust.main.dto.game;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

import com.codejoust.main.util.InstantDeserializer;
import com.codejoust.main.util.InstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Getter
@Setter
@EqualsAndHashCode
public class GameTimerDto {

    @JsonSerialize(using = InstantSerializer.class)
    @JsonDeserialize(using = InstantDeserializer.class)
    private Instant startTime;

    @JsonSerialize(using = InstantSerializer.class)
    @JsonDeserialize(using = InstantDeserializer.class)
    private Instant endTime;
    private Long duration;
    private boolean timeUp;
}
