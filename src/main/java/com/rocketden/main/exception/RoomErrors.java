package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import org.springframework.http.HttpStatus;

public class RoomErrors {

    public final static ApiError ROOM_NOT_FOUND = new ApiError(HttpStatus.NOT_FOUND,
            "A room could not be found with the given id.");

    public final static ApiError USER_ALREADY_PRESENT = new ApiError(HttpStatus.CONFLICT,
            "A user with the features provided has already joined the room.");

    public final static ApiError NO_HOST = new ApiError(HttpStatus.BAD_REQUEST,
            "There is no host provided.");
}
