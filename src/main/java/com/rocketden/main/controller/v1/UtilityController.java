package com.rocketden.main.controller.v1;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UtilityController extends BaseRestController {

    @GetMapping("/get-instant")
    public ResponseEntity<Instant> getInstant() {
        return new ResponseEntity<>(Instant.now(), HttpStatus.OK);
    }
}
