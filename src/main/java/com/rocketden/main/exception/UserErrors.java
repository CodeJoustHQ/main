package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import org.springframework.http.HttpStatus;

public class UserErrors {

    public final static ApiError INVALID_USER = new ApiError(HttpStatus.BAD_REQUEST,
            "Please provide a user with a valid nickname (1-16 characters without spaces).");
}
