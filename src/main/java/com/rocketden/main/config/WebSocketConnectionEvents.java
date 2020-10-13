package com.rocketden.main.config;

import java.util.LinkedList;
import java.util.Map;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.room.RoomMapper;
import com.rocketden.main.dto.room.UpdateHostRequest;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.Room;
import com.rocketden.main.model.User;
import com.rocketden.main.service.RoomService;
import com.rocketden.main.util.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Configuration
@EnableWebSocketMessageBroker
@Transactional
public class WebSocketConnectionEvents {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate template;
    private final RoomService roomService;

    private static final String CONNECT_MESSAGE = "simpConnectMessage";
    private static final String NATIVE_HEADERS = "nativeHeaders";

    @Autowired
    public WebSocketConnectionEvents(UserRepository userRepository, SimpMessagingTemplate template, RoomService roomService) {
        this.userRepository = userRepository;
        this.template = template;
        this.roomService = roomService;
    }

    @EventListener
    @SuppressWarnings("unchecked")
    public void onSocketConnected(SessionConnectedEvent event) {
        /**
         * Grab the custom headers on connection. Unchecked cast warnings are
         * suppressed: see method header.
         */
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        GenericMessage<byte[]> genericMessage = 
            (GenericMessage<byte[]>) event.getMessage().getHeaders().get(CONNECT_MESSAGE);
        Map<String, LinkedList<String>> customHeaderMap = 
            (Map<String, LinkedList<String>>) genericMessage.getHeaders().get(NATIVE_HEADERS);

        // Retrieve the ID of the user to update.
        String userId = customHeaderMap.get("userId").get(0);

        // Get the unique auto-generated session ID for this connection.
        String sessionId = sha.getSessionId();

        // Update the session ID of the relevant user.
        User user = userRepository.findUserByUserId(userId);
        user.setSessionId(sessionId);
        userRepository.save(user);

        // Get room and send socket update.
        Room room = user.getRoom();
        RoomDto roomDto = RoomMapper.toDto(room);
        sendSocketUpdate(roomDto);
    }

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        // Grab the custom headers on connection.
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        sha.getSessionId();
        String sessionId = sha.getSessionId();

        // Remove the user from the database and send socket update.
        // TODO: This could throw a null exception.
        User user = userRepository.findUserBySessionId(sessionId);
        user.setSessionId(null);
        userRepository.save(user);

        // Get room, conditionally update the host, and send socket update.
        Room room = user.getRoom();
        conditionallyUpdateRoomHost(room, user);
        RoomDto roomDto = RoomMapper.toDto(room);
        sendSocketUpdate(roomDto);
    }

    // Send updates about new users to the client through sockets
    public void sendSocketUpdate(RoomDto roomDto) {
        String socketPath = String.format(Utility.SOCKET_PATH, roomDto.getRoomId());
        template.convertAndSend(socketPath, roomDto);
    }

    /**
     * This method updates the room host as long as:
     * 1. The disconnected user is the room's host, and
     * 2. The room has another active non-host user.
     */
    public void conditionallyUpdateRoomHost(Room room, User user) {
        // If the disconnected user is the host and another active user is present, reassign the host for the room.
        if (room.getHost().equals(user)) {
            UpdateHostRequest updateHostRequest = new UpdateHostRequest();
            updateHostRequest.setInitiator(UserMapper.toDto(user));

            // Get the first active non-host user, if one exists.
            for (User roomUser : room.getUsers()) {
                if (roomUser.getSessionId() != null && !roomUser.equals(room.getHost())) {
                    updateHostRequest.setNewHost(UserMapper.toDto(roomUser));
                    break;
                }
            }

            // Determine whether an active non-host user was found, and if so, send an update room host request.
            if (updateHostRequest.getNewHost() != null) {
                roomService.updateRoomHost(room.getRoomId(), updateHostRequest);
            }
        }   
    }
}
