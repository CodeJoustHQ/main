package com.rocketden.main.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Difficulty {
    EASY, MEDIUM, HARD;

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static Difficulty fromString(String value) {
        return Difficulty.valueOf(value.toUpperCase());
    }
}
