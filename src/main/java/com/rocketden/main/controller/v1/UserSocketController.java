package com.rocketden.main.controller.v1;

import java.util.ArrayList;
import java.util.List;

import com.rocketden.main.model.User;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    List<User> users = new ArrayList<>();

    @MessageMapping("/user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public List<User> user(String nickname) {
        User user = new User();
        user.setNickname(nickname);
        users.add(user);
        return users;
    }
}
