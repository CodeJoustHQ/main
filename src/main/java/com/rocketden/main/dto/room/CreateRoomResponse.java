package com.rocketden.main.dto.room;

import com.rocketden.main.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomResponse {
    private String roomId;
    private User host;
}
