package com.codejoust.main.model.report;

import com.codejoust.main.exception.GameError;
import com.codejoust.main.exception.api.ApiException;
import com.fasterxml.jackson.annotation.JsonCreator;

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
