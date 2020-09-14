package com.rocketden.main.exception.api;

import lombok.Getter;

// Response object returned to client containing message
@Getter
public class ApiErrorResponse {
    private final String message;

    public ApiErrorResponse(String message) {
        this.message = message;
    }
}
