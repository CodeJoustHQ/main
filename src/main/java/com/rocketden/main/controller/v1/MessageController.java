package com.rocketden.main.controller.v1;

import com.rocketden.main.model.Message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController extends BaseRestController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @GetMapping("/hello")
    public Message hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Message("Hello, " + name + "!");
    }

    @MessageMapping(BaseRestController.BASE_SOCKET_URL + "/receive-greeting")
    @SendTo(BaseRestController.BASE_SOCKET_URL + "/send-greeting")
    public String greeting(String message) throws InterruptedException {
        Thread.sleep(1000); // simulated delay
        logger.info(message);
    	return message;
    }
}
