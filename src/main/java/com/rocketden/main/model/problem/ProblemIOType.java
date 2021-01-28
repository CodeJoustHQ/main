package com.rocketden.tester.model.problem;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rocketden.tester.exception.ProblemError;
import com.rocketden.tester.exception.api.ApiException;

import lombok.Getter;

@Getter
public enum ProblemIOType {
    
    STRING(String.class),
    INTEGER(Integer.class),
    DOUBLE(Double.class),
    CHARACTER(Character.class),
    BOOLEAN(Boolean.class),
    ARRAY_STRING(String[].class),
    ARRAY_INTEGER(Integer[].class),
    ARRAY_DOUBLE(Double[].class),
    ARRAY_CHARACTER(Character[].class),
    ARRAY_BOOLEAN(Boolean[].class);

    private final Class<?> classType;

    ProblemIOType(Class<?> classType) {
        this.classType = classType;
    }

    // Convert a matching string (ignoring case) to enum object
    @JsonCreator
    public static ProblemIOType fromString(String value) {
        try {
            return ProblemIOType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(ProblemError.BAD_IOTYPE);
        }
    }

    public boolean typeMatches(Object value) {
        return value.getClass().equals(this.getClassType());
    }
}
