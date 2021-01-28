package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum GameError implements ApiError {

    BAD_LANGUAGE(HttpStatus.BAD_REQUEST, "An invalid language was chosen."),
    BAD_SETTING(HttpStatus.BAD_REQUEST, "An invalid game setting was provided."),
    EMPTY_FIELD(HttpStatus.BAD_REQUEST, "Please ensure a value is provided for each required field."),
    GAME_NOT_OVER(HttpStatus.FORBIDDEN, "You may not perform this action because the game is not over."),
    INVALID_PERMISSIONS(HttpStatus.FORBIDDEN, "You do not have permission to perform this action."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A game could not be found with the given id."),
    NOTIFICATION_REQUIRES_CONTENT(HttpStatus.BAD_REQUEST, "The request action could not be completed because content is required for this notification."),
    NOTIFICATION_REQUIRES_INITIATOR(HttpStatus.BAD_REQUEST, "The request action could not be completed because an initiator is required for this notification."),
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
