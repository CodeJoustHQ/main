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
        String nickname = request.getNickname();

        // If the provided nickname is null or invalid, do not add the user.
        if (nickname == null) {
            CreateUserResponse response = new CreateUserResponse();
            response.setMessage(CreateUserResponse.ERROR_NO_NICKNAME);
            return response;
        } else if (!validNickname(nickname)) {
            CreateUserResponse response = new CreateUserResponse();
            response.setMessage(CreateUserResponse.ERROR_INVALID_NICKNAME);
            return response;
        }
        
        User user = new User();
        user.setNickname(nickname);
        repository.save(user);

        CreateUserResponse response = UserMapper.entityToCreateResponse(user);
        response.setMessage(CreateUserResponse.SUCCESS);

        return response;
    }

    /**
     * The requirements for validity are as follows:
     * 1. Non-null and non-empty
     * 2. Less than or equal to sixteen characters
     * 3. Contains no spaces
     */
    public static boolean validNickname(String nickname) {
        return nickname != null && nickname.length() > 0
                && nickname.length() <= 16 && !nickname.contains(" ");
    }

}
