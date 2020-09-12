package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.CreateUserResponse;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public CreateUserResponse createUser(CreateUserRequest request) {
        User user = new User();
        user.setNickname(request.getNickname());
        repository.save(user);

        CreateUserResponse response = UserMapper.entityToCreateResponse(user);
        response.setMessage(CreateUserResponse.SUCCESS);

        return response;
    }
}
