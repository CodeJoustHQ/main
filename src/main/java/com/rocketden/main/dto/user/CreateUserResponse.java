package com.rocketden.main.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserResponse {
    public static final String SUCCESS = "Successfully created user.";
    public static final String ERROR_NO_NICKNAME = "No nickname is provided for the user.";
    public static final String ERROR_INVALID_NICKNAME = "The provided nickname" 
        + " is invalid, for one of four reasons: it is empty, longer than" 
        + " sixteen characters, or contains a space.";

    private String message;
    private String nickname;
}
