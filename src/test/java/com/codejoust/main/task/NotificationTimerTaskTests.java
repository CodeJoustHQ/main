package com.codejoust.main.task;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

import java.time.Instant;
import java.util.Timer;

import com.codejoust.main.dto.game.GameNotificationDto;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.NotificationType;
import com.codejoust.main.service.SocketService;

import com.codejoust.main.util.NotificationTimerTask;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class NotificationTimerTaskTests {

    // Predefine room and time left attributes.
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

        Timer timer = new Timer();
        NotificationTimerTask notificationTimerTask = new NotificationTimerTask(socketService, ROOM_ID, TIME_LEFT);
        timer.schedule(notificationTimerTask, (long) 1 * 1000);

        /**
         * Confirm that the socket update is not called immediately, 
         * but is called 1 second later (wait for timer task).
         */

        verify(socketService, never()).sendSocketUpdate(eq(ROOM_ID), Mockito.any(GameNotificationDto.class));

        ArgumentCaptor<GameNotificationDto> argument = ArgumentCaptor.forClass(GameNotificationDto.class);
        verify(socketService, timeout(1500)).sendSocketUpdate(eq(ROOM_ID), argument.capture());
        GameNotificationDto notificationDtoResult = argument.getValue();
        assertNull(notificationDtoResult.getInitiator());
        assertEquals(NotificationType.TIME_LEFT, notificationDtoResult.getNotificationType());
        assertEquals(TIME_LEFT, notificationDtoResult.getContent());
        assertTrue(Instant.now().isAfter(notificationDtoResult.getTime())
            || Instant.now().minusSeconds((long) 1).isBefore(notificationDtoResult.getTime()));
    }
}
