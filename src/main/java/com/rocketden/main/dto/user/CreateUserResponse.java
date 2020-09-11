package com.rocketden.main.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserResponse {
    public static final String SUCCESS = "Successfully created user.";

    private String message;
    private String nickname;
}
