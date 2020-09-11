package com.rocketden.main.dto.room;

import com.rocketden.main.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomResponse {
    public static final String SUCCESS = "Successfully created room.";

    private String message;
    private String roomId;
    private User host;
}
