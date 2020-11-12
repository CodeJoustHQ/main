package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum GameError implements ApiError {

    BAD_SETTING(HttpStatus.BAD_REQUEST, "An invalid game setting was provided."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A game could not be found with the given id.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    GameError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
