package com.rocketden.main.exception.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    // Catches all ApiExceptions and returns proper error response to client
    @ExceptionHandler(ApiException.class)
    protected ResponseEntity<ApiErrorResponse> handleApiException(ApiException e) {
        ApiError apiError = e.getError();
        return new ResponseEntity<>(apiError.getResponse(), apiError.getStatus());
    }
}
