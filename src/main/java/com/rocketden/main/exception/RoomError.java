package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum RoomError implements ApiError {

    BAD_SETTING(HttpStatus.BAD_REQUEST, "An invalid room setting was provided."),
    BAD_ROOM_SIZE(HttpStatus.BAD_REQUEST, "An invalid room size was provided."),
    INACTIVE_USER(HttpStatus.BAD_REQUEST, "The specified user is inactive."),
    INVALID_PERMISSIONS(HttpStatus.FORBIDDEN, "You do not have permission to perform this action"),
    NO_HOST(HttpStatus.BAD_REQUEST, "There is no host provided."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A room could not be found with the given id."),
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "A user with the nickname provided has already joined the room."),
    ALREADY_ACTIVE(HttpStatus.FORBIDDEN, "This room has already started; please wait for the host to play again."),
    ALREADY_FULL(HttpStatus.FORBIDDEN, "Cannot join a room that is already full.");

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
