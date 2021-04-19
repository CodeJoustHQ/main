package com.codejoust.main.service;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import com.codejoust.main.config.WebSocketConfig;
import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.dto.user.UserDto;

import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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

    @Test
    public void sendSocketUpdate() {
        RoomDto roomDto = new RoomDto();
        roomDto.setRoomId(TestFields.ROOM_ID);
        UserDto userDto = new UserDto();
        userDto.setNickname(TestFields.NICKNAME);
        roomDto.setHost(userDto);

        socketService.sendSocketUpdate(roomDto);
        verify(template).convertAndSend(
                eq(String.format(WebSocketConfig.SOCKET_LOBBY, roomDto.getRoomId())),
                eq(roomDto));
    }
    
}
