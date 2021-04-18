package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

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
