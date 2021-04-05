package com.rocketden.main.util;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.model.User;
import com.rocketden.main.service.RoomService;
import com.rocketden.main.service.UserService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class UtilityTests {

    @Spy
    @InjectMocks
    private Utility utility;

    @Mock
    private UserRepository userRepository;
    
    @Mock
	private RoomRepository roomRepository;

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

    @Test
    public void generateValidUserIdSecondTime() {
        /**
         * Simulate first user ID already existing in the database, and second 
         * user ID not present in the database.
         */
        User nullUser = null;
        Mockito.doReturn(new User(), nullUser).when(userRepository).findUserByUserId(Mockito.any(String.class));
        String userId = utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY);

        // Confirm that the method was indeed called two times.
        verify(userRepository, times(2)).findUserByUserId(Mockito.any(String.class));

        assertEquals(UserService.USER_ID_LENGTH, userId.length());

        for (char c : userId.toCharArray()) {
            assertTrue(c >= '0');
            assertTrue(c <= '9');
        }
    }

    @Test
    public void generateUserIdInvalidType() {
        assertThrows(IllegalArgumentException.class, () -> utility.generateUniqueId(UserService.USER_ID_LENGTH, "INVALID_KEY"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"await", "7del", "finally", "is", "elif"})
    public void validateIdentifierFalse(String inputName) {
        assertFalse(Utility.validateIdentifier(inputName));
    }

    @ParameterizedTest
    @ValueSource(strings = {"rocket", "rocketrocket", "hi12", "H$ello", "jimmyNeutron"})
    public void validateIdentifierTrue(String inputName) {
        assertTrue(Utility.validateIdentifier(inputName));
    }
}
