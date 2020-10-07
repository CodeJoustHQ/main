package com.rocketden.main.dto.room;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.Difficulty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoomDto {

    private String roomId;
    private UserDto host;
    private List<UserDto> users;
    private Difficulty difficulty;
}
