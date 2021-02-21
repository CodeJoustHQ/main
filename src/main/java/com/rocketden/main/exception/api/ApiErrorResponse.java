package com.rocketden.main.exception.api;

import java.io.Serializable;

import lombok.EqualsAndHashCode;
import lombok.Getter;

// Response object returned to client containing message and error type (name of enum var)
@Getter
@EqualsAndHashCode
public class ApiErrorResponse implements Serializable {
    
    /**
     * Include default serial ID to circumvent warning.
     */
    private static final long serialVersionUID = 1L;

    private final String message;
    private final String type;

    public ApiErrorResponse(String message, String type) {
        this.message = message;
        this.type = type;
    }
}
