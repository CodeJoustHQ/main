package com.rocketden.main.controller.v1;

import com.rocketden.main.model.Message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

@RestController
public class MessageController extends BaseRestController {

    @GetMapping("/hello")
    public Message hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Message("Hello, " + name + "!");
    }

    // Are @MessageMapping and @SendTo both necessary?
    @MessageMapping("/hello")
	@SendTo("/topic/greetings")
	public Message greeting(Message message) throws Exception {
		Thread.sleep(1000); // simulated delay
		return new Message("Hello, " + HtmlUtils.htmlEscape(message.getMessage()) + "!");
	}
}
