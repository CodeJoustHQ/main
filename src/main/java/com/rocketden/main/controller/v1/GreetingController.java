package com.rocketden.main.controller.v1;

import java.awt.Color;
import java.util.Random;

import com.rocketden.main.model.User;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController extends BaseRestController {

    private final Random random = new Random();

    @MessageMapping("/greeting")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-greeting")
    public User greeting(String nickname) throws InterruptedException {
        Thread.sleep(1000); // simulated delay
        User user = new User();
        user.setNickname(nickname);
        user.setColor(new Color(random.nextInt(255), random.nextInt(255), random.nextInt(255)));
    	return user;
    }
}
