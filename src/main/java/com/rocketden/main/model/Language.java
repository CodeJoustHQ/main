package com.rocketden.main.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.LanguageError;
import com.rocketden.main.exception.api.ApiException;


import lombok.Getter;

@Getter
public enum Language {

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

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static Language fromString(String value) {
        try {
            return Language.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(LanguageError.BAD_LANGUAGE);
        }
    }
}
