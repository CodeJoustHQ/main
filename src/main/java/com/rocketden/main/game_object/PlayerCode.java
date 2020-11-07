package com.rocketden.main.game_object;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerCode {

    // Updated field to hold the user's current-language code.
    private String code;

    private CodeLanguage language;

}
