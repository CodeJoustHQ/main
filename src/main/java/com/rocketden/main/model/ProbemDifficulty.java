package com.rocketden.main.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiException;

public enum ProbemDifficulty {
    EASY, MEDIUM, HARD;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static ProbemDifficulty fromString(String value) {
        try {
            return ProbemDifficulty.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(RoomError.BAD_SETTING);
        }
    }
}
