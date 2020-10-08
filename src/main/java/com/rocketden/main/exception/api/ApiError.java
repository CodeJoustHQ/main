package com.rocketden.main.exception.api;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

// Interface representing an API error that holds status and response object
public interface ApiError extends Serializable {

    HttpStatus getStatus();

    ApiErrorResponse getResponse();

    String getMessage();
}
