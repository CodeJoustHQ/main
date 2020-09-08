package com.rocketden.main.controller.v1;

import com.rocketden.main.model.User;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    @MessageMapping("/user-list")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user-list")
    public User user(String nickname) throws InterruptedException {
        Thread.sleep(1000); // simulated delay
        User user = new User();
        user.setNickname(nickname);
    	return user;
    }
}
