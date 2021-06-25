package com.codejoust.main.model.report;

import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum GameEndType {
    TIME_UP, ALL_SOLVED, MANUAL_END;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static GameEndType fromString(String value) {
        try {
            return GameEndType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        }
    }
}
