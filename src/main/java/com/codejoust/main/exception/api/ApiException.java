package com.codejoust.main.exception.api;

import lombok.Getter;

// Exception used to trigger API error responses
@Getter
public class ApiException extends RuntimeException {
    /**
     * Hard-coded serial version ID to avoid warning.
     */
    private static final long serialVersionUID = 1L;
    private final ApiError error;

    public ApiException(ApiError error) {
        super(error.getMessage());
        this.error = error;
    }
}
