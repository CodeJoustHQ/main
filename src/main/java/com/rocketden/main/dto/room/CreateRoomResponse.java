package com.rocketden.main.dto.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomResponse {
    public static final String SUCCESS = "Successfully created room.";

    private String message;
    private String roomId;
    // future: add fields such as list of other players
}
