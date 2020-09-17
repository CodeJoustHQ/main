package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.user.UserDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserSocketController extends BaseRestController {

    @MessageMapping("/user")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/subscribe-user")
    public UserDto user(String nickname) {
        UserDto user = new UserDto();
        user.setNickname(nickname);
        return user;
    }
}
