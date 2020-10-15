package com.rocketden.main.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import com.rocketden.main.service.RoomService;
import com.rocketden.main.service.UserService;

import org.junit.Test;

public class UtilityTests {

    private final Utility utility = new Utility();

    @Test
    public void generateValidRoomId() {
        // Verify room ids are generated correctly
        String roomId = utility.generateId(RoomService.ROOM_ID_LENGTH);

        assertEquals(RoomService.ROOM_ID_LENGTH, roomId.length());

        for (char c : roomId.toCharArray()) {
            assertTrue(c >= '0');
            assertTrue(c <= '9');
        }
    }

    @Test
    public void generateValidUserId() {
        // Verify user ids are generated correctly
        String userId = utility.generateId(UserService.USER_ID_LENGTH);

        assertEquals(UserService.USER_ID_LENGTH, userId.length());

        for (char c : userId.toCharArray()) {
            assertTrue(c >= '0');
            assertTrue(c <= '9');
        }
    }
    
}
