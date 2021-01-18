package com.rocketden.main.game_object;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.api.ApiException;

public enum GameNotification {
    SUBMIT_CORRECT, SUBMIT_INCORRECT, TEST_CORRECT, CODE_STREAK, ONE_MIN_REMAINING;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static GameNotification fromString(String value) {
        try {
            return GameNotification.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(GameError.BAD_SETTING);
        }
    }
}
