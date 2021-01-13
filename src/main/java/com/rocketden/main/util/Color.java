package com.rocketden.main.util;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class Color {

    private static final String INVALID_COLOR_NUM =
        "The r, g, and b fields must all be between 0 and 255.";

    public Color(int r, int g, int b) {
        if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
            throw new IllegalArgumentException(INVALID_COLOR_NUM);
        }

        this.r = r;
        this.g = g;
        this.b = b;
    }

    private int r;
    private int g;
    private int b;
    
}
