package com.codejoust.main.entity;

import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;

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
        user.setNickname(TestFields.NICKNAME);
        user.setId(TestFields.ID);

        room.addUser(user);

        assertEquals(1, room.getUsers().size());
        assertEquals(room, user.getRoom());
    }

    @Test
    public void removeUserFromRoomSet() {
        Room room = new Room();

        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setId(TestFields.ID);
        user.setUserId(TestFields.USER_ID);
        room.addUser(user);
        
        User userToRemove = new User();
        userToRemove.setNickname(TestFields.NICKNAME_2);
        userToRemove.setId(TestFields.ID_2);
        userToRemove.setUserId(TestFields.USER_ID_2);

        assertFalse(room.removeUser(userToRemove));
        assertTrue(room.getUsers().contains(user));

        // Update userToRemove to match user in attributes, but not ID.
        userToRemove.setNickname(TestFields.NICKNAME);
        userToRemove.setUserId(TestFields.USER_ID);
        assertTrue(room.removeUser(userToRemove));
        assertFalse(room.getUsers().contains(userToRemove));
        assertFalse(room.getUsers().contains(user));
    }

    @Test
    public void getEquivalentUserSucceeds() {
        Room room = new Room();

        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setId(TestFields.ID);
        user.setUserId(TestFields.USER_ID);
        room.addUser(user);

        User userToGet = new User();
        userToGet.setNickname(TestFields.NICKNAME_2);
        userToGet.setId(TestFields.ID_2);
        userToGet.setUserId(TestFields.USER_ID_2);

        assertNull(room.getEquivalentUser(userToGet));

        // Update userToGet to confirm that user is same despite different ID.
        userToGet.setNickname(TestFields.NICKNAME);
        userToGet.setUserId(TestFields.USER_ID);
        User actual = room.getEquivalentUser(userToGet);

        assertEquals(user.getNickname(), actual.getNickname());
        assertEquals(user.getId(), actual.getId());
        assertEquals(user.getUserId(), actual.getUserId());
    }
}
