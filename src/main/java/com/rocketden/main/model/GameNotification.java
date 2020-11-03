package com.rocketden.main.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.api.ApiException;

public enum GameNotification {
    SUBMIT_CORRECT, SUBMIT_INCORRECT, TEST, CODE_STREAK;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static ProblemDifficulty fromString(String value) {
        try {
            return ProblemDifficulty.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(GameError.BAD_SETTING);
        }
    }
}
