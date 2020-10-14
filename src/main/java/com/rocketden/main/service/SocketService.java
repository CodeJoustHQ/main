package com.rocketden.main.service;

import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.util.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SocketService {

    private final SimpMessagingTemplate template;

    @Autowired
    public SocketService(SimpMessagingTemplate template) {
        this.template = template;
    }

    // Send updates about new users to the client through sockets
    public void sendSocketUpdate(RoomDto roomDto) {
        String socketPath = String.format(Utility.SOCKET_PATH, roomDto.getRoomId());
        template.convertAndSend(socketPath, roomDto);
    }
    
}
