package com.codejoust.main.exception;

import lombok.Getter;

import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;

import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@Getter
public class TestCaseError implements ApiError {

    /**
     * Include default serial ID to circumvent warning.
     */
    private static final long serialVersionUID = 1L;

    public static final String INPUT_FIELD = "INPUT";
    public static final String OUTPUT_FIELD = "OUTPUT";

    private static final String INVALID_INPUT_TYPE = "INVALID_INPUT";
    private static final String INVALID_INPUT_MESSAGE = "Please ensure each line of test case input/output is valid and is of the correct type.";

    private static final String INCORRECT_COUNT_TYPE = "INCORRECT_INPUT_COUNT";
    private static final String INCORRECT_COUNT_MESSAGE = "Please specify the correct number of parameters for this problem.";

    private final HttpStatus status;
    private final ApiErrorResponse response;

    private TestCaseError(String message, String type, int index, String field) {
        this.status = HttpStatus.BAD_REQUEST;

        Map<String, Object> map = new HashMap<>();
        map.put("index", index);
        map.put("field", field);
        this.response = new ApiErrorResponse(message, type, map);
    }

    public String getMessage() {
        return this.response.getMessage();
    }

    public static TestCaseError invalidInput(int index, String field) {
        return new TestCaseError(INVALID_INPUT_MESSAGE, INVALID_INPUT_TYPE, index, field);
    }

    public static TestCaseError incorrectCount(int index) {
        return new TestCaseError(INCORRECT_COUNT_MESSAGE, INCORRECT_COUNT_TYPE, index, null);
    }
}
