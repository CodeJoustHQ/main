package com.codejoust.main.dto.game;


import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.game_object.CodeLanguage;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EndGameRequest {
    private UserDto initiator;
}
