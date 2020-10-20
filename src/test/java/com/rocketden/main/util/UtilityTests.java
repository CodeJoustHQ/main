package com.rocketden.main.util;

import com.rocketden.main.service.RoomService;
import com.rocketden.main.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@SpringBootTest
public class UtilityTests {

    private final Utility utility;

    @Autowired
    public UtilityTests(Utility utility) {
        this.utility = utility;
    }

    @Test
    public void generateValidRoomId() {
        // Verify room ids are generated correctly
        String roomId = utility.generateUniqueId(RoomService.ROOM_ID_LENGTH, Utility.ROOM_ID_KEY);

        assertEquals(RoomService.ROOM_ID_LENGTH, roomId.length());

        for (char c : roomId.toCharArray()) {
            assertTrue(c >= '0');
            assertTrue(c <= '9');
        }
    }

    @Test
    public void generateValidUserId() {
        // Verify user ids are generated correctly
        String userId = utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY);

        assertEquals(UserService.USER_ID_LENGTH, userId.length());

        for (char c : userId.toCharArray()) {
            assertTrue(c >= '0');
            assertTrue(c <= '9');
        }
    }
}
