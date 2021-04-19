package com.codejoust.main.service;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.time.Instant;

import com.codejoust.main.dto.game.GameNotificationDto;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.exception.NotificationError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.NotificationType;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;

import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTests {

    @Mock
    private SocketService socketService;

    @Mock
    private GameManagementService gameService;

    @Spy
    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void sendNotificationSuccess() throws Exception {
        Room room = new Room();
        room.setRoomId(TestFields.ROOM_ID);

        User user = new User();
        user.setNickname(TestFields.NICKNAME);
        user.setUserId(TestFields.USER_ID);
        room.addUser(user);

        User host = new User();
        user.setNickname(TestFields.NICKNAME_2);
        user.setUserId(TestFields.USER_ID_2);
        room.addUser(host);
        room.setHost(host);

        gameService.createAddGameFromRoom(room);

        GameNotificationDto notificationDto = new GameNotificationDto();
        notificationDto.setInitiator(UserMapper.toDto(user));
        notificationDto.setTime(Instant.now());
        notificationDto.setContent(TestFields.CONTENT);
        notificationDto.setNotificationType(NotificationType.TEST_CORRECT);

        GameNotificationDto result = notificationService.sendNotification(TestFields.ROOM_ID, notificationDto);

        verify(socketService).sendSocketUpdate(eq(TestFields.ROOM_ID), eq(notificationDto));
        assertEquals(notificationDto, result);
    }

    @Test
    public void sendNotificationBadNotificationType() throws Exception {
        ApiException exception = assertThrows(ApiException.class, () -> NotificationType.fromString("nonexistent"));
        assertEquals(NotificationError.BAD_NOTIFICATION_TYPE, exception.getError());
    }
    
}
