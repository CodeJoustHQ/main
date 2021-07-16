package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public enum NotificationError implements ApiError {

    BAD_NOTIFICATION_TYPE(HttpStatus.BAD_REQUEST, "Please choose a valid notification type (correct or incorrect submission, correct test, code streak, time left, etc)."),
    NOTIFICATION_REQUIRES_CONTENT(HttpStatus.BAD_REQUEST, "The request action could not be completed because content is required for this notification."),
    NOTIFICATION_REQUIRES_INITIATOR(HttpStatus.BAD_REQUEST, "The request action could not be completed because an initiator is required for this notification.");

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
