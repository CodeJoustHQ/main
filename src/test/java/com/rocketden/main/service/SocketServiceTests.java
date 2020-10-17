package com.rocketden.main.service;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import com.rocketden.main.config.WebSocketConfig;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserDto;

import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@ExtendWith(MockitoExtension.class)
public class SocketServiceTests {

    @Mock
    private SimpMessagingTemplate template;

    @Spy
    @InjectMocks
    private SocketService socketService;

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String ROOM_ID = "012345";

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void sendSocketUpdate() {
        RoomDto roomDto = new RoomDto();
        roomDto.setRoomId(ROOM_ID);
        UserDto userDto = new UserDto();
        userDto.setNickname(NICKNAME);
        roomDto.setHost(userDto);

        socketService.sendSocketUpdate(roomDto);
        verify(template).convertAndSend(
                eq(String.format(WebSocketConfig.SOCKET_PATH, roomDto.getRoomId())),
                eq(roomDto));
    }
    
}
