package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public enum GameError implements ApiError {

    BAD_LANGUAGE(HttpStatus.BAD_REQUEST, "An invalid language was chosen."),
    BAD_SETTING(HttpStatus.BAD_REQUEST, "An invalid game setting was provided."),
    EMPTY_FIELD(HttpStatus.BAD_REQUEST, "Please ensure a value is provided for each required field."),
    GAME_NOT_OVER(HttpStatus.FORBIDDEN, "You may not perform this action because the game is not over."),
    INVALID_PERMISSIONS(HttpStatus.FORBIDDEN, "You do not have permission to perform this action."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A game could not be found with the given id."),
    TESTER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "An internal error occurred connecting to the tester service."),
    USER_NOT_IN_GAME(HttpStatus.BAD_REQUEST, "The requested action could not be completed because the user is not in the game.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    GameError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
