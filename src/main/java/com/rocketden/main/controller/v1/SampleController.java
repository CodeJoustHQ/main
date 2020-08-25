package com.rocketden.main.controller.v1;

import com.rocketden.main.model.SampleObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SampleController extends BaseRestController {

    @GetMapping("/hello")
    public SampleObject hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new SampleObject("Hello, " + name + "!");
    }
}
