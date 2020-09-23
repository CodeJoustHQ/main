package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.DeleteUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController extends BaseRestController {

    private final UserService service;

    @Autowired
    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/user")
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request) {
        return new ResponseEntity<>(service.createUser(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/user")
    public ResponseEntity<Boolean> deleteUser(@RequestBody DeleteUserRequest request) {
        boolean response = service.deleteUser(request);
        return new ResponseEntity<>(response, response ? HttpStatus.ACCEPTED : HttpStatus.NOT_FOUND);
    }
}
