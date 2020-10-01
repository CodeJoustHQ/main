package com.rocketden.main.Utility;

import java.util.Random;

public class Utility {

    private static final Random random = new Random();

    // Generate numeric String with a specific length.
    public static String generateId(int length) {
        String numbers = "1234567890";
        char[] values = new char[length];

        for (int i = 0; i < values.length; i++) {
            int index = random.nextInt(numbers.length());
            values[i] = numbers.charAt(index);
        }

        return new String(values);
    }
}
