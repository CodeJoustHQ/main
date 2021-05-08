package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public enum AccountError implements ApiError {

    INVALID_CREDENTIALS(HttpStatus.BAD_REQUEST, "You do not have permission to perform this action. Ensure you're logged in to an account with valid permissions.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    AccountError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
