package com.rocketden.main.exception.api;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private ApiError error;

    public ApiException(ApiError error) {
        super(error.getMessage());
        this.error = error;
    }
}
