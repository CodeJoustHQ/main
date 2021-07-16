package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public enum RoomError implements ApiError {

    ACTIVE_GAME(HttpStatus.FORBIDDEN, "This room has already started; please wait for the host to play again before changing spectator status."),
    ALREADY_FULL(HttpStatus.FORBIDDEN, "Cannot join a room that is already full."),
    BAD_ROOM_SIZE(HttpStatus.BAD_REQUEST, "An invalid room size was provided."),
    BAD_SETTING(HttpStatus.BAD_REQUEST, "An invalid room setting was provided."),
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "A user with the nickname provided has already joined the room."),
    INACTIVE_USER(HttpStatus.BAD_REQUEST, "The specified user is inactive."),
    INVALID_PERMISSIONS(HttpStatus.FORBIDDEN, "You do not have permission to perform this action"),
    NO_HOST(HttpStatus.BAD_REQUEST, "There is no host provided."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A room could not be found with the given id."),
    TOO_MANY_PROBLEMS(HttpStatus.BAD_REQUEST, "Please select fewer problems or increase the room's problem limit."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "The specified user could not be found in the room.");

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
