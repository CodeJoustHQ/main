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
        user.setNickname("test");

        room.addUser(user);

        assertEquals(1, room.getUsers().size());
        assertEquals(room, user.getRoom());
    }

    @Test
    public void removeUserFromRoomSet() {
        Room room = new Room();

        User user = new User();
        user.setNickname("test");
        user.setId(1);
        room.addUser(user);
        
        User userToRemove = new User();
        userToRemove.setNickname("nonexistent");
        user.setId(2);

        assertFalse(room.removeUser(userToRemove));
        assertTrue(room.getUsers().contains(user));

        userToRemove.setNickname("test");
        assertTrue(room.removeUser(userToRemove));
        assertFalse(room.getUsers().contains(user));
    }

    @Test
    public void getEquivalentUserSucceeds() {
        Room room = new Room();

        User user = new User();
        user.setNickname("test");
        user.setId(1);
        room.addUser(user);

        User userToGet = new User();
        userToGet.setNickname("nonexistent");
        user.setId(2);

        assertNull(room.getEquivalentUser(userToGet));

        userToGet.setNickname("test");

        User actual = room.getEquivalentUser(userToGet);

        assertEquals(user.getNickname(), actual.getNickname());
        assertEquals(user.getId(), actual.getId());
    }
}
