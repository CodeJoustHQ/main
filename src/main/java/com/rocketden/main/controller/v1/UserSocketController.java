package com.rocketden.main.controller.v1;

import java.util.HashSet;
import java.util.Set;

import com.rocketden.main.model.User;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    Set<User> users = new HashSet<>();

    @MessageMapping("/add-user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public Set<User> addUser(String nickname) {
        User user = new User();
        user.setNickname(nickname);
        users.add(user);
        return users;
    }

    @MessageMapping("/delete-user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public Set<User> deleteUser(String nickname) {
        User user = new User();
        user.setNickname(nickname);
        users.remove(user);
        return users;
    }
}
