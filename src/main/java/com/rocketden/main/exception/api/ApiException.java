package com.rocketden.main.exception.api;

import lombok.Getter;

// Exception used to trigger API error responses
@Getter
public class ApiException extends RuntimeException {
    private final ApiError error;

    public ApiException(ApiError error) {
        super(error.getMessage());
        this.error = error;
    }
}
