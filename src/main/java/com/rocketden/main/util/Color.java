package com.rocketden.main.util;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class Color {

    private String gradientColor;

    public Color() {}

    public Color(String gradientColor) {
        this.gradientColor = gradientColor;
    }
}
