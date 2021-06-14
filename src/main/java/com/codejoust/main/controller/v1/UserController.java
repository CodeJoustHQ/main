package com.codejoust.main.controller.v1;

import com.codejoust.main.dto.user.CreateUserRequest;
import com.codejoust.main.dto.user.DeleteUserRequest;
import com.codejoust.main.dto.user.UpdateUserAccountRequest;
import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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

    @PutMapping("/user/account")
    public ResponseEntity<UserDto> updateUserAccount(@RequestBody UpdateUserAccountRequest request, @RequestHeader(name="Authorization") String token) {
        return new ResponseEntity<>(service.updateUserAccount(request, token), HttpStatus.CREATED);
    }

    @DeleteMapping("/user")
    public ResponseEntity<UserDto> deleteUser(@RequestBody DeleteUserRequest request) {
        return new ResponseEntity<>(service.deleteUser(request), HttpStatus.OK);
    }
}
