package com.codejoust.main.game_object;

import com.codejoust.main.exception.NotificationError;
import com.codejoust.main.exception.api.ApiException;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum NotificationType {
    SUBMIT_CORRECT, SUBMIT_INCORRECT, TEST_CORRECT, CODE_STREAK, TIME_LEFT;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static NotificationType fromString(String value) {
        try {
            return NotificationType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(NotificationError.BAD_NOTIFICATION_TYPE);
        }
    }
}
