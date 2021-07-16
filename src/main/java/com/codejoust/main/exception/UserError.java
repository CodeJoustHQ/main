package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public enum UserError implements ApiError {

    IN_ROOM(HttpStatus.BAD_REQUEST, "The requested action could not be completed because the user is in a room."),
    INVALID_USER(HttpStatus.BAD_REQUEST, "Please provide a user with a valid nickname (1-16 characters without spaces)."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A user with given nickname could not be found in database.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    UserError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
