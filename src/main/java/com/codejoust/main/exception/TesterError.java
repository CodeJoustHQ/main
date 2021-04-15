package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public class TesterError implements ApiError {

    /**
     * Include default serial ID to circumvent warning.
     */
    private static final long serialVersionUID = 1L;
    
    private final HttpStatus status;
    private final ApiErrorResponse response;

    public TesterError(HttpStatus status, ApiErrorResponse response) {
        this.status = status;
        this.response = response;
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
