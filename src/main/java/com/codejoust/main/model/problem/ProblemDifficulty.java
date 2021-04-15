package com.codejoust.main.model.problem;

import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum ProblemDifficulty {
    EASY, MEDIUM, HARD, RANDOM;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static ProblemDifficulty fromString(String value) {
        try {
            return ProblemDifficulty.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        }
    }
}
