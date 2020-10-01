package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum RoomError implements ApiError {

    NO_HOST(HttpStatus.BAD_REQUEST, "There is no host provided."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A room could not be found with the given id."),
    USER_WITH_NICKNAME_ALREADY_PRESENT(HttpStatus.CONFLICT, "A user with the nickname provided has already joined the room.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    RoomError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
