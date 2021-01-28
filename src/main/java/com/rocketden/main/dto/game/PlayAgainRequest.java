package com.rocketden.main.dto.game;

import com.rocketden.main.dto.user.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayAgainRequest {
    private UserDto initiator;
}
