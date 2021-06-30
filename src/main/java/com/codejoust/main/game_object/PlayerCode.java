package com.codejoust.main.game_object;

import com.codejoust.main.model.report.CodeLanguage;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class PlayerCode {

    private String code;

    private CodeLanguage language;

    public PlayerCode() {}

    public PlayerCode(String code, CodeLanguage language) {
        this.code = code;
        this.language = language;
    }

}
