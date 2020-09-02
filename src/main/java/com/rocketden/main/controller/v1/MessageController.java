package com.rocketden.main.controller.v1;

import com.rocketden.main.model.Message;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController extends BaseRestController {
    @GetMapping("/hello")
    public Message hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Message("Hello, " + name + "!");
    }
}
