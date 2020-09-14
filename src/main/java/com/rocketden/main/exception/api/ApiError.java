package com.rocketden.main.exception.api;

import lombok.Getter;
import org.springframework.http.HttpStatus;

// Error object holding message and status details
@Getter
public class ApiError {
    private final HttpStatus status;
    private final ApiErrorResponse response;

    public ApiError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message);
    }

    public String getMessage() {
        return this.response.message;
    }

    // Response object returned to client containing message
    @Getter
    public static class ApiErrorResponse {
        private final String message;

        public ApiErrorResponse(String message) {
            this.message = message;
        }
    }
}
