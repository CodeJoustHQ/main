package com.rocketden.main.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SampleObject {
    private String message;

    public SampleObject(String message) {
        this.message = message;
    }
}
