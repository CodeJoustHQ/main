package com.rocketden.main.game_object;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.api.ApiException;

import org.apache.commons.lang.WordUtils;

import lombok.Getter;

@Getter
public enum CodeLanguage {

    PYTHON,
    RUBY,
    SWIFT,
    CPP,
    PHP,
    C,
    JAVA,
    JAVASCRIPT,
    RUST,
    BASH;

    private final String driverGeneratorName;

    CodeLanguage() {
        this.driverGeneratorName = String.format("%sDefaultCodeGeneratorService", WordUtils.capitalizeFully(this.name()));
    }

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
