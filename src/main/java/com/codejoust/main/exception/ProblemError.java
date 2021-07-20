package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

@Getter
public enum ProblemError implements ApiError {

    BAD_DIFFICULTY(HttpStatus.BAD_REQUEST, "Please choose either Easy, Medium, or Hard (or Random if choosing a room difficulty)"),
    BAD_INPUT(HttpStatus.BAD_REQUEST, "None of the problem inputs provided can be null."),
    BAD_IOTYPE(HttpStatus.BAD_REQUEST, "Please choose a valid Problem IO Type."),
    BAD_PROBLEM_TAG(HttpStatus.FORBIDDEN, "Please choose a valid name for the problem tag."),
    BAD_VERIFIED_STATUS(HttpStatus.BAD_REQUEST, "Cannot verify a problem with no test cases."),
    DUPLICATE_TAG_NAME(HttpStatus.BAD_REQUEST, "The same problem tag name was supplied multiple times for the same problem."),
    EMPTY_FIELD(HttpStatus.BAD_REQUEST, "Please enter a value for each required field."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "An internal error occurred when attempting to find a problem."),
    INVALID_NUMBER_REQUEST(HttpStatus.BAD_REQUEST, "Please request a valid number of problems (between 1-10)."),
    INVALID_VARIABLE_NAME(HttpStatus.BAD_REQUEST, "Please ensure all variable names are valid for Java and Python."),
    NOT_ENOUGH_FOUND(HttpStatus.NOT_FOUND, "Not enough problems could be found with the given criteria."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A problem could not be found with the given criteria."),
    TAG_NAME_ALREADY_EXISTS(HttpStatus.FORBIDDEN, "A problem tag with this name already exists."),
    TAG_NOT_FOUND(HttpStatus.NOT_FOUND, "A problem tag with these attributes could not be found.");

    private final HttpStatus status;
    private final ApiErrorResponse response;

    ProblemError(HttpStatus status, String message) {
        this.status = status;
        this.response = new ApiErrorResponse(message, this.name());
    }

    public String getMessage() {
        return this.response.getMessage();
    }
}
