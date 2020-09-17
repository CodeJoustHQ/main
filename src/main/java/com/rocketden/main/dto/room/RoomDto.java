package com.rocketden.main.dto.room;

import com.rocketden.main.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class RoomDto {

    private String roomId;
    private User host;
    private Set<User> users;
}
