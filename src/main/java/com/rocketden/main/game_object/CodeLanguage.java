package com.rocketden.main.game_object;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.api.ApiException;

public enum CodeLanguage {
    JAVA, JAVASCRIPT, PYTHON, CSHARP, CPLUSPLUS;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static CodeLanguage fromString(String value) {
        try {
            return CodeLanguage.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(GameError.BAD_LANGUAGE);
        }
    }
}
