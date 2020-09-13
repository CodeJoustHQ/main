package com.rocketden.main.controller.v1;

import com.rocketden.main.model.User;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    @MessageMapping("/user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public User user(String nickname) {
        User user = new User();
        user.setNickname(nickname);
        return user;
    }
}
