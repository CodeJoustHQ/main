package com.rocketden.main.util;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.game_object.NotificationType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Utility {

    // List notifications that require an initiator.
    public static final List<NotificationType> initiatorNotifications =
        Arrays.asList(NotificationType.SUBMIT_CORRECT,
            NotificationType.SUBMIT_INCORRECT, NotificationType.CODE_STREAK,
            NotificationType.TEST_CORRECT);

    public static final List<NotificationType> contentNotifications = 
        Arrays.asList(NotificationType.SUBMIT_CORRECT,
            NotificationType.TEST_CORRECT, NotificationType.TIME_LEFT);

    private static final Random random = new Random();
    public static final String ROOM_ID_KEY = "ROOM_ID";
    public static final String USER_ID_KEY = "USER_ID";

    /**
     * Colors to be generated for players.
     */
    public static final Color RED = new Color("red");
    public static final Color YELLOW = new Color("yellow");
    public static final Color GREEN = new Color("green");
    public static final Color BLUE = new Color("blue");
    public static final Color PURPLE = new Color("purple");
    public static final Color PINK = new Color("pink");
    public static final List<Color> COLOR_LIST = List.of(RED, YELLOW, GREEN, BLUE, PURPLE, PINK);

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
