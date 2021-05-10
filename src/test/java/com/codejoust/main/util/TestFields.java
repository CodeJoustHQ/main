package com.codejoust.main.util;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.game_object.PlayerCode;
import com.codejoust.main.model.Account;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.service.FirebaseService;

public class TestFields {

    // User constants
    public static final String NICKNAME = "rocket";
    public static final String NICKNAME_2 = "rocketrocket";
    public static final String NICKNAME_3 = "rocketandrocket";
    public static final String NICKNAME_4 = "rocketrocketrocket";
    public static final String NICKNAME_5 = "rocketandrocketrocket";
    public static final String USER_ID = "012345";
    public static final String USER_ID_2 = "678910";
    public static final String USER_ID_3 = "024681";
    public static final String SESSION_ID = "abcde";
    public static final String SESSION_ID_2 = "fghij";
    public static final Integer ID = 1;
    public static final Integer ID_2 = 2;

    // Room constants
    public static final String ROOM_ID = "012345";
    public static final long DURATION = 600;

    // Problem constants
    public static final String PROBLEM_NAME = "Sort an Array";
    public static final String PROBLEM_DESCRIPTION = "Sort an array from lowest to highest value.";
    public static final String PROBLEM_ID = "abcxyz";
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
    public static final String PROBLEM_ID_2 = "zyx-cba";
    public static final ProblemIOType IO_TYPE_2 = ProblemIOType.INTEGER;
    public static final String INPUT_3 = "[1, 2, 8]";
    public static final String OUTPUT_3 = "8";

    public static final String PYTHON_CODE = "print('hello')";
    public static final CodeLanguage PYTHON_LANGUAGE = CodeLanguage.PYTHON;
    public static final PlayerCode PLAYER_CODE = new PlayerCode(PYTHON_CODE, PYTHON_LANGUAGE);

    public static final Integer NUM_PROBLEMS = 10;

    // Notification constants
    public static final String CONTENT = "[1, 2, 3]";
    public static final String TIME_CONTENT = "are thirty minutes";
    public static final String NAME = "Sort a List";
    public static final String DESCRIPTION = "Sort the given list in O(n log n) time.";

    // Account constants
    public static final String TOKEN = "aWbXcYdZ123";
    public static final String UID = FirebaseService.TEST_UID;

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

    public static Account account1() {
        Account account = new Account();
        account.setUid(UID);
        return account;
    }
}
