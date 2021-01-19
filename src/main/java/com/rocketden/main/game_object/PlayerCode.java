package com.rocketden.main.game_object;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class PlayerCode {

    private String code;
    private String language;

    public PlayerCode(String code, String language) {
        this.code = code;
        this.language = language;
    }

}
