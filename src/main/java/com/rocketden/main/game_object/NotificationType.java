package com.rocketden.main.game_object;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.NotificationError;
import com.rocketden.main.exception.api.ApiException;

public enum NotificationType {
    SUBMIT_CORRECT, SUBMIT_INCORRECT, TEST_CORRECT, CODE_STREAK, TIME_LEFT;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static NotificationType fromString(String value) {
        try {
            return NotificationType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(NotificationError.BAD_SETTING);
        }
    }
}
