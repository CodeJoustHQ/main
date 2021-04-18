package com.codejoust.main.util;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.model.problem.ProblemIOType;

public class TestFields {

    // User constants
    public static final String NICKNAME = "rocket";
    public static final String NICKNAME_2 = "rocketrocket";
    public static final String NICKNAME_3 = "rocketandrocket";
    public static final String USER_ID = "012345";
    public static final String USER_ID_2 = "678910";
    public static final String USER_ID_3 = "024681";

    // Room constants
    public static final String ROOM_ID = "012345";
    public static final long DURATION = 600;

    // Problem constants
    public static final String PROBLEM_NAME = "Sort an Array";
    public static final String PROBLEM_DESCRIPTION = "Sort an array from lowest to highest value.";
    public static final String INPUT_NAME = "nums";
    public static final ProblemIOType IO_TYPE = ProblemIOType.ARRAY_INTEGER;

    public static final String INPUT = "[1, 3, 2]";
    public static final String OUTPUT = "[1, 2, 3]";
    public static final String EXPLANATION = "2 < 3, so those are swapped.";
    public static final String INPUT_2 = "[-1, 5, 0, 3]";
    public static final String OUTPUT_2 = "[-1, 0, 3, 5]";
    public static final String EXPLANATION_2 = "5 is the largest, so it should be at the end.";
    public static final Double RUNTIME = 5.5;

    public static final String PROBLEM_NAME_2 = "Find Maximum";
    public static final String PROBLEM_DESCRIPTION_2 = "Find the maximum value in an array.";

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

    public static UserDto userDto3() {
        UserDto user = new UserDto();
        user.setNickname(NICKNAME_3);
        user.setUserId(USER_ID_3);
        return user;
    }
}
