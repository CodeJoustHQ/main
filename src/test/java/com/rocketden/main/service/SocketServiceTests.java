package com.rocketden.main.service;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.util.Utility;

import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class SocketServiceTests {

    @Mock
    private SimpMessagingTemplate template;

    @Spy
    @InjectMocks
    private SocketService socketService;

    @Test
    public void sendSocketUpdate() {
        RoomDto roomDto = new RoomDto();
        roomDto.setRoomId("123456");
        UserDto userDto = new UserDto();
        userDto.setNickname("test");
        roomDto.setHost(userDto);

        socketService.sendSocketUpdate(roomDto);
        verify(template).convertAndSend(
                eq(String.format(Utility.SOCKET_PATH, roomDto.getRoomId())),
                eq(roomDto));
    }
    
}
