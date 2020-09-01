package com.rocketden.main.dto.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomResponse {

    public static final String SUCCESS = "Sucessfully joined room.";
    public static final String ERROR_NOT_FOUND = "A room could not be found with the given id.";

    private String message;
    private String roomId;
    private String playerName;
    // future: add fields such as list of other players
}
