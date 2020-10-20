package com.rocketden.main.util;

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
        while (id == null || idExists(id, idType)) {
            for (int i = 0; i < values.length; i++) {
                int index = random.nextInt(numbers.length());
                values[i] = numbers.charAt(index);
            }
            id = new String(values);
        }
        return id;
    }

    // Determine if the id of idType already exists in the database.
    private boolean idExists(String id, String idType) {
        if (idType.equals(ROOM_ID_KEY)) {
            return roomRepository.findRoomByRoomId(id) != null;
        } else if (idType.equals(USER_ID_KEY)) {
            return userRepository.findUserByUserId(id) != null; 
        }
        
        // Return false for case where invalid or not present idType is given.
        return true;
    }
}
