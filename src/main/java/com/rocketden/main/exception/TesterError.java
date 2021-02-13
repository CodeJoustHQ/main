package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class TesterError implements ApiError {

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
