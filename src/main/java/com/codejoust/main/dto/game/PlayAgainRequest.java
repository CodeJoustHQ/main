package com.codejoust.main.dto.game;

import com.codejoust.main.dto.user.UserDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayAgainRequest {
    private UserDto initiator;
}
