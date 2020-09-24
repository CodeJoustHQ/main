package com.rocketden.main.controller.v1;

import java.util.HashSet;
import java.util.Set;

import com.rocketden.main.dto.user.UserDto;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    private static final String SEND_TO_PATH = BaseRestController.BASE_SOCKET_URL + "/{roomId}/subscribe-user";

    private Set<UserDto> users = new HashSet<>();

    @MessageMapping("/{roomId}/add-user")
    @SendTo(SEND_TO_PATH)
    public Set<UserDto> addUser(@DestinationVariable String roomId, String nickname) {
        UserDto user = new UserDto();
        user.setNickname(nickname);
        users.add(user);
        return users;
    }

    @MessageMapping("{roomId}/delete-user")
    @SendTo(SEND_TO_PATH)
    public Set<UserDto> deleteUser(@DestinationVariable String roomId, String nickname) {
        UserDto user = new UserDto();
        user.setNickname(nickname);
        users.remove(user);
        return users;
    }
}
