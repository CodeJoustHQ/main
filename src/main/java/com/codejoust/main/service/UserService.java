package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
import com.codejoust.main.dao.UserRepository;
import com.codejoust.main.dto.user.CreateUserRequest;
import com.codejoust.main.dto.user.DeleteUserRequest;
import com.codejoust.main.dto.user.UpdateUserAccountRequest;
import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.exception.UserError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.User;
import com.codejoust.main.util.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository repository;
    private final FirebaseService firebaseService;
    private final AccountRepository accountRepository;
    private final Utility utility;
    
    // The length of the user ID.
    public static final int USER_ID_LENGTH = 6;

    @Autowired
    public UserService(UserRepository repository,
        FirebaseService firebaseService, AccountRepository accountRepository,
        Utility utility) {
        this.repository = repository;
        this.firebaseService = firebaseService;
        this.accountRepository = accountRepository;
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

    public UserDto updateUserAccount(UpdateUserAccountRequest request, String token) {
        User user = repository.findUserByUserId(request.getUser().getUserId());

        if (token == null) {
            user.setAccount(null);
        } else {
            String uid = firebaseService.verifyToken(token);
            user.setAccount(accountRepository.findAccountByUid(uid));
        }

        repository.save(user);

        return UserMapper.toDto(user);
    }

    public UserDto deleteUser(DeleteUserRequest request) {
        if (request.getUserToDelete() == null) {
            throw new ApiException(UserError.INVALID_USER);
        }

        User user = repository.findUserByUserId(request.getUserToDelete().getUserId());

        // If requested user does not exist in database, throw an exception.
        if (user == null) {
            throw new ApiException(UserError.NOT_FOUND);
        }

        // If requested user is in a room, throw an exception.
        if (user.getRoom() != null) {
            throw new ApiException(UserError.IN_ROOM);
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
