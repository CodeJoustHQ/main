package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum NotificationError implements ApiError {

    BAD_NOTIFICATION_TYPE(HttpStatus.BAD_REQUEST, "Please choose a valid notification type (correct or incorrect submission, correct test, code streak, time left, etc).");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    NotificationError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
