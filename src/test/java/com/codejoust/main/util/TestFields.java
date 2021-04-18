package com.codejoust.main.util;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.service.SubmitService;

public class TestFields {

    public static final String NICKNAME = "rocket";
    public static final String NICKNAME_2 = "rocketrocket";
    public static final String NICKNAME_3 = "rocketandrocket";
    public static final String USER_ID = "012345";
    public static final String USER_ID_2 = "678910";
    public static final String USER_ID_3 = "024681";

    public static final String ROOM_ID = "012345";
    public static final long DURATION = 600;

    public static final String INPUT = "[1, 3, 2]";
    public static final String OUTPUT = "[1, 2, 3]";
    public static final Double RUNTIME = 5.5;

    public static final String PYTHON_CODE = "print('hello')";
    public static final CodeLanguage PYTHON_LANGUAGE = CodeLanguage.PYTHON;

    public static UserDto userDto1() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME);
        user.setUserId(USER_ID);
        return user;
    }

    public static UserDto userDto2() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_2);
        user.setUserId(USER_ID_2);
        return user;
    }
}
