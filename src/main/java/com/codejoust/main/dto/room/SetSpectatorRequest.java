package com.codejoust.main.dto.room;

import com.codejoust.main.dto.user.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetSpectatorRequest {
    private UserDto initiator;
    private UserDto receiver;
    private Boolean spectator;
}
