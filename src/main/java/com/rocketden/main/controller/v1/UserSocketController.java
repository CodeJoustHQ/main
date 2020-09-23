package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.user.UserDto;
import java.util.HashSet;
import java.util.Set;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    Set<UserDto> users = new HashSet<>();

    @MessageMapping("/add-user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public Set<UserDto> addUser(String nickname) {
        UserDto user = new UserDto();
        user.setNickname(nickname);
        users.add(user);
        return users;
    }

    @MessageMapping("/delete-user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public Set<UserDto> deleteUser(String nickname) {
        UserDto user = new UserDto();
        user.setNickname(nickname);
        users.remove(user);
        return users;
    }
}
