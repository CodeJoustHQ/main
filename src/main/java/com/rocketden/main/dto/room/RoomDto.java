package com.rocketden.main.dto.room;

import com.rocketden.main.dto.user.UserDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoomDto {
    private String roomId;
    private UserDto host;
    private List<UserDto> users;
    private List<UserDto> activeUsers;
    private List<UserDto> inactiveUsers;
}
