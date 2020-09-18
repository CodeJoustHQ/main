package com.rocketden.main.exception.api;

import org.springframework.http.HttpStatus;

// Interface representing an API error that holds status and response object
public interface ApiError {

    HttpStatus getStatus();

    ApiErrorResponse getResponse();

    String getMessage();
}
