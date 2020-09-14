package com.rocketden.main.exception.api;

import lombok.EqualsAndHashCode;
import lombok.Getter;

// Response object returned to client containing message
@Getter
@EqualsAndHashCode
public class ApiErrorResponse {
    private final String message;

    public ApiErrorResponse(String message) {
        this.message = message;
    }
}
