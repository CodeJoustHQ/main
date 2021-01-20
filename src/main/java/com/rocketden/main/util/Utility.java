package com.rocketden.main.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dao.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Utility {

    private static final Random random = new Random();
    public static final String ROOM_ID_KEY = "ROOM_ID";
    public static final String USER_ID_KEY = "USER_ID";

    /**
     * Colors to be generated for players.
     */
    public static final Color RED = new Color("#ff2929");
    public static final Color ORANGE = new Color("#ff7a29");
    public static final Color BROWN = new Color("#bf7f35");
    public static final Color YELLOW = new Color("#fad02e");
    public static final Color GREEN = new Color("#91fa49");
    public static final Color TURQUOISE = new Color("#36d8b8");
    public static final Color BLUE = new Color("#3b89ff");
    public static final Color VIOLET = new Color("#9a1ef9");
    public static final Color PINK = new Color("#ff5dcc");
    public static final Color GREY = new Color("#b3bac1");
    public static final Color WHITE = new Color("#ffffff");
    public static final Color BLACK = new Color("#000000");
    public static final List<Color> COLOR_LIST = Collections.unmodifiableList
        (Arrays.asList(RED, ORANGE, BROWN, YELLOW, GREEN, TURQUOISE, BLUE,
            VIOLET, PINK, GREY, WHITE, BLACK));

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Autowired
    public Utility(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    // Generate numeric String with a specific length.
    public String generateUniqueId(int length, String idType) {
        String numbers = "1234567890";
        char[] values = new char[length];
        String id = null;
        
        /**
         * Continue generating new id values until a valid one is provided.
         * Note: This loop could technically run forever, but there are 9^6
         * (531,441) possible combinations, so this works for now (10/20/2020).
         */
        try {
            while (id == null || idExists(id, idType)) {
                for (int i = 0; i < values.length; i++) {
                    int index = random.nextInt(numbers.length());
                    values[i] = numbers.charAt(index);
                }
                id = new String(values);
            }
            return id;
        } catch (IllegalArgumentException e) {
            // Throw IllegalArgumentException for invalid id type.
            throw new IllegalArgumentException(e);
        }
    }

    // Determine if the id of idType already exists in the database.
    private boolean idExists(String id, String idType) {
        switch (idType) {
            case (ROOM_ID_KEY):
                return roomRepository.findRoomByRoomId(id) != null;
            case (USER_ID_KEY):
                return userRepository.findUserByUserId(id) != null; 
            default:
                throw new IllegalArgumentException(String.format("The provided id type of %s is invalid.", idType));
        }
    }
}
