package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerCode {

    // Updated field to hold the user's current-language code.
    private String code;

    private CodeLanguage codeLanguage;

}
