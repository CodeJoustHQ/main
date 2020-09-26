package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum UserError implements ApiError {

    INVALID_USER(HttpStatus.BAD_REQUEST, "Please provide a user with a valid nickname (1-16 characters without spaces)."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A user with given nickname could not be found in database.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    UserError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
