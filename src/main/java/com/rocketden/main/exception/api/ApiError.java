package com.rocketden.main.exception.api;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

// Error object holding response message and status details
@Getter
@EqualsAndHashCode
public class ApiError {
    private final HttpStatus status;
    private final ApiErrorResponse response;

    public ApiError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message);
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
