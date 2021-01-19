package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum TimerError implements ApiError {

    INVALID_DURATION(HttpStatus.BAD_REQUEST, "Please enter a valid duration between 1-60 minutes."),
    NULL_SETTING(HttpStatus.BAD_REQUEST, "The game, associated game timer, room, room ID, and socket service must not be null.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    TimerError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
