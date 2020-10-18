package com.rocketden.main.entity;

import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

@SpringBootTest
public class RoomEntityTests {

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final Integer ID = 1;
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String USER_ID_2 = "678910";
    private static final Integer ID_2 = 1;

    @Test
    public void roomInitialization() {
        Room room = new Room();

        assertNull(room.getHost());
        assertNotNull(room.getUsers());
        assertTrue(room.getUsers().isEmpty());
    }

    @Test
    public void addUserToRoomSet() {
        Room room = new Room();

        User user = new User();
        user.setNickname(NICKNAME);
        user.setId(ID);

        room.addUser(user);

        assertEquals(1, room.getUsers().size());
        assertEquals(room, user.getRoom());
    }

    @Test
    public void removeUserFromRoomSet() {
        Room room = new Room();

        User user = new User();
        user.setNickname(NICKNAME);
        user.setId(ID);
        user.setUserId(USER_ID);
        room.addUser(user);
        
        User userToRemove = new User();
        userToRemove.setNickname(NICKNAME_2);
        userToRemove.setId(ID_2);
        userToRemove.setUserId(USER_ID_2);

        assertFalse(room.removeUser(userToRemove));
        assertTrue(room.getUsers().contains(user));

        assertTrue(room.removeUser(user));
        assertFalse(room.getUsers().contains(user));
    }

    @Test
    public void getEquivalentUserSucceeds() {
        Room room = new Room();

        User user = new User();
        user.setNickname(NICKNAME);
        user.setId(ID);
        user.setUserId(USER_ID);
        room.addUser(user);

        User userToGet = new User();
        userToGet.setNickname(NICKNAME_2);
        userToGet.setId(ID_2);
        userToGet.setUserId(USER_ID_2);

        assertNull(room.getEquivalentUser(userToGet));

        User actual = room.getEquivalentUser(user);

        assertEquals(user.getNickname(), actual.getNickname());
        assertEquals(user.getUserId(), actual.getUserId());
    }
}
