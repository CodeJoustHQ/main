package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import org.springframework.http.HttpStatus;

public class RoomErrors {

    public static ApiError ROOM_NOT_FOUND = new ApiError(HttpStatus.NOT_FOUND,
            "A room could not be found with the given id.");
}
