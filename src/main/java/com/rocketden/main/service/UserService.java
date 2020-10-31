package com.rocketden.main.service;

import com.rocketden.main.dao.UserRepository;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.DeleteUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.User;
import com.rocketden.main.util.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository repository;
    private final Utility utility;
    
    // The length of the user ID.
    public static final int USER_ID_LENGTH = 6;

    @Autowired
    public UserService(UserRepository repository, Utility utility) {
        this.repository = repository;
        this.utility = utility;
    }

    public UserDto createUser(CreateUserRequest request) {
        String nickname = request.getNickname();

        // If the provided nickname is null or invalid, do not add the user.
        if (!validNickname(nickname)) {
            throw new ApiException(UserError.INVALID_USER);
        }
        
        User user = new User();
        user.setNickname(nickname);

        // If no user ID is present set a new automatically-generated user ID.
        if (request.getUserId() == null) {
            user.setUserId(utility.generateUniqueId(UserService.USER_ID_LENGTH, Utility.USER_ID_KEY));
        } else {
            user.setUserId(request.getUserId());
        }
        
        repository.save(user);

        return UserMapper.toDto(user);
    }

    public UserDto deleteUser(DeleteUserRequest request) {
        User user = repository.findUserByUserId(request.getUserId());

        // If requested user does not exist in database, throw an exception. 
        if (user == null) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        repository.delete(user);

        return UserMapper.toDto(user);
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
