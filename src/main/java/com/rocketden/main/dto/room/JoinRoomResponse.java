package com.rocketden.main.dto.room;

import java.util.Set;

import com.rocketden.main.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomResponse {
    private String roomId;
    private Set<User> users;
}
