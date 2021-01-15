package com.rocketden.main.util;

import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

import java.time.LocalDateTime;
import java.util.Timer;

import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.GameNotificationDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.game_object.NotificationType;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.service.SocketService;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class NotificationTimerTaskTests {

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";
    private static final String SESSION_ID = "234567";
    private static final String ROOM_ID = "012345";
    private static final String TIME_LEFT = "are sixty minutes";

    @Mock
    private SocketService socketService;

    @BeforeEach
    public void setup() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void notificationTimerTaskSocketMessageNullSocketService() {
        assertThrows(ApiException.class, () -> new NotificationTimerTask(null, ROOM_ID, TIME_LEFT));
    }

    @Test
    public void notificationTimerTaskSocketMessageNullRoomId() {
        assertThrows(ApiException.class, () -> new NotificationTimerTask(socketService, null, TIME_LEFT));
    }

    @Test
    public void notificationTimerTaskSocketMessageNullTimeLeft() {
        assertThrows(ApiException.class, () -> new NotificationTimerTask(socketService, ROOM_ID, null));
    }

    @Test
    public void notificationTimerTaskSocketMessage() {
        MockitoAnnotations.initMocks(this);

        GameNotificationDto notificationDto = new GameNotificationDto();
        notificationDto.setInitiator(null);
        notificationDto.setTime(null);
        notificationDto.setNotificationType(NotificationType.TIME_LEFT);
        notificationDto.setContent(TIME_LEFT);

        Timer timer = new Timer();
        NotificationTimerTask notificationTimerTask = new NotificationTimerTask(socketService, ROOM_ID, TIME_LEFT);
        timer.schedule(notificationTimerTask, (long) 1 * 1000);

        /**
         * Confirm that the socket update is not called immediately, 
         * but is called 1 second later (wait for timer task).
         */

        verify(socketService, never()).sendSocketUpdate(eq(ROOM_ID), eq(notificationDto));

        verify(socketService, timeout(1000)).sendSocketUpdate(eq(ROOM_ID), eq(notificationDto));
    }
}
