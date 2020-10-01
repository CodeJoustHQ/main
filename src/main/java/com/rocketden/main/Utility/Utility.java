package com.rocketden.main.Utility;

import java.util.Random;

import com.rocketden.main.controller.v1.BaseRestController;

public class Utility {

    private Utility() {}

    private static final Random random = new Random();
    public static final String SOCKET_PATH = BaseRestController.BASE_SOCKET_URL + "/%s/subscribe-user";

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
