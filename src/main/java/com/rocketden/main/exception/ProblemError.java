package com.rocketden.main.exception;

import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ProblemError implements ApiError {

    BAD_DIFFICULTY(HttpStatus.BAD_REQUEST, "Please choose either Easy, Medium, or Hard (or Random if choosing a room difficulty)"),
    BAD_INPUT(HttpStatus.BAD_REQUEST, "None of the problem inputs provided can be null."),
    BAD_IOTYPE(HttpStatus.BAD_REQUEST, "Please choose a value Problem IO Type."),
    INCORRECT_INPUT_COUNT(HttpStatus.BAD_REQUEST, "Please specify the correct number of parameters for this problem."),
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "Please ensure each line of test case input/output is valid and is of the correct type."),
    INVALID_NUMBER_REQUEST(HttpStatus.BAD_REQUEST, "Please request a valid number of problems."),
    INVALID_VARIABLE_NAME(HttpStatus.BAD_REQUEST, "Please ensure all variable names are valid for Java and Python."),
    EMPTY_FIELD(HttpStatus.BAD_REQUEST, "Please enter a value for each required field."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "A problem could not be found with the given criteria.");

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
