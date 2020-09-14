package com.rocketden.main.dto.room;

import com.rocketden.main.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomResponse {
    public static final String SUCCESS = "Successfully created room.";
    public static final String ERROR_NO_HOST = "There is no host provided.";

    private String message;
    private String roomId;
    private User host;
}
