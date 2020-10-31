package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ProblemError implements ApiError {

    EMPTY_FIELD(HttpStatus.BAD_REQUEST, "Please enter a value for each required field."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A problem could not be found with the given id.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    ProblemError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
