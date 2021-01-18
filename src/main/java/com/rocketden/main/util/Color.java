package com.rocketden.main.util;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class Color {

    private static final String INVALID_COLOR_STR =
        "The hexadecimal fields must all be of the form '#XXXXXX'.";

    public Color(String hexColor) {
        if (hexColor.charAt(0) != '#' || hexColor.length() != 7) {
            throw new IllegalArgumentException(INVALID_COLOR_STR);
        }

        // Ensure that all characters are of valid hexadecimal form.
        for (int index = 1; index < 7; index++) {
            char hexChar = Character.toUpperCase(hexColor.charAt(index));
            
            if ((hexChar < '0' || hexChar > '9') &&
                (hexChar < 'A' || hexChar > 'F')) {
                throw new IllegalArgumentException(INVALID_COLOR_STR);
            }
        }

        this.hexColor = hexColor;
    }

    private String hexColor;
    
}
