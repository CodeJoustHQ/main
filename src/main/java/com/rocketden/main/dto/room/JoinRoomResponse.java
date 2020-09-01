package com.rocketden.main.dto.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomResponse {
    private String message;
    private String roomId;
    private String playerName;
    // future: add fields such as list of other players
}
