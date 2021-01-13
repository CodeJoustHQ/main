package com.rocketden.main.game_object;

import java.time.LocalDateTime;

import com.rocketden.main.model.User;

public class GameNotification {

    // The user that initiates the notification (may be null).
    private User initiator;

    // The time the notification is sent.
    private LocalDateTime time;
    
    // The type of notification sent.
    private NotificationType notificationType;
    
    // Optional content for the notification.
    private String content;
}
