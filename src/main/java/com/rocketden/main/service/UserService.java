package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.CreateUserResponse;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UserService {

    public static final int USER_ID_LENGTH = 6;

    private final UserRepository repository;
    private static final Random random = new Random();

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public CreateUserResponse createUser(CreateUserRequest request) {
        User user = new User();
        user.setUserId(generateUserId());
        user.setNickname(request.getNickname());
        repository.save(user);

        CreateUserResponse response = UserMapper.entityToCreateResponse(user);
        response.setMessage(CreateUserResponse.SUCCESS);

        return response;
    }

    // Generate numeric String with length User_ID_LENGTH
    protected String generateUserId() {
        String numbers = "1234567890";
        char[] values = new char[USER_ID_LENGTH];

        for (int i = 0; i < values.length; i++) {
            int index = random.nextInt(numbers.length());
            values[i] = numbers.charAt(index);
        }

        return new String(values);
    }
}