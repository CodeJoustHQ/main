package com.rocketden.main.dto.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomRequest {
    private String roomId;
    private String playerName;
}
