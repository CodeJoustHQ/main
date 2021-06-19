package com.codejoust.main.api;

import com.codejoust.main.dto.user.CreateUserRequest;
import com.codejoust.main.dto.user.DeleteUserRequest;
import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.exception.UserError;
import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;
import com.codejoust.main.util.MockHelper;
import com.codejoust.main.util.TestFields;
import com.codejoust.main.util.TestUrls;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class UserTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void createNewUser() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(TestFields.NICKNAME);
        request.setUserId(TestFields.USER_ID);

        UserDto expected = TestFields.userDto1();

        UserDto actual = MockHelper.postRequest(this.mockMvc, TestUrls.user(), request, UserDto.class, HttpStatus.CREATED);

        assertEquals(expected.getNickname(), actual.getNickname());
        assertEquals(expected.getUserId(), actual.getUserId());
    }

    @Test
    public void createNewUserNoUserIdSuccess() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(TestFields.NICKNAME);

        UserDto expected = TestFields.userDto1();

        UserDto actual = MockHelper.postRequest(this.mockMvc, TestUrls.user(), request, UserDto.class, HttpStatus.CREATED);
        assertEquals(expected.getNickname(), actual.getNickname());
    }

    @Test
    public void createNewUserNoNickname() throws Exception {
        CreateUserRequest request = new CreateUserRequest();

        ApiError ERROR = UserError.INVALID_USER;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.user(), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "rocketrocketrocketrocket", "rocket rocket"})
    public void createNewUserInvalidNickname(String nickname) throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(nickname);

        ApiError ERROR = UserError.INVALID_USER;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.user(), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void deleteExistingUser() throws Exception {
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setNickname(TestFields.NICKNAME);
        createUserRequest.setUserId(TestFields.USER_ID);

        UserDto expected = MockHelper.postRequest(this.mockMvc, TestUrls.user(), createUserRequest, UserDto.class, HttpStatus.CREATED);

        DeleteUserRequest deleteUserRequest = new DeleteUserRequest();
        deleteUserRequest.setUserToDelete(expected);

        UserDto actual = MockHelper.deleteRequest(this.mockMvc, TestUrls.user(), deleteUserRequest, UserDto.class, HttpStatus.OK);
        assertEquals(expected.getUserId(), actual.getUserId());
    }

    @Test
    public void deleteNonExistentUser() throws Exception {
        UserDto user = TestFields.userDto1();

        DeleteUserRequest request = new DeleteUserRequest();
        request.setUserToDelete(user);

        ApiError ERROR = UserError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.deleteRequest(this.mockMvc, TestUrls.user(), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void updateUserAccountNone() throws Exception {
        /**
         * 1. Create a user through a POST request.
         * 2. Create the PUT request with no token to update user account.
         * 3. Verify that no account is attached to the user.
         */

        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setNickname(TestFields.NICKNAME);
        createUserRequest.setUserId(TestFields.USER_ID);

        UserDto expected = MockHelper.postRequest(this.mockMvc, TestUrls.user(), createUserRequest, UserDto.class, HttpStatus.CREATED);

        UserDto actual = MockHelper.putRequestNoHeaders(this.mockMvc, TestUrls.updateUserAccount(expected.getUserId()), new Object(), UserDto.class, HttpStatus.OK);
        assertEquals(expected.getUserId(), actual.getUserId());
        assertNull(actual.getAccountUid());
    }

    @Test
    public void updateUserAccountPresent() throws Exception {
        /**
         * 1. Create a user through a POST request.
         * 2. Create the PUT request with an token to update user account.
         * 3. Verify that the account is attached to the user.
         */

        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setNickname(TestFields.NICKNAME);
        createUserRequest.setUserId(TestFields.USER_ID);

        UserDto expected = MockHelper.postRequest(this.mockMvc, TestUrls.user(), createUserRequest, UserDto.class, HttpStatus.CREATED);

        UserDto actual = MockHelper.putRequest(this.mockMvc, TestUrls.updateUserAccount(expected.getUserId()), new Object(), UserDto.class, HttpStatus.OK);
        assertEquals(expected.getUserId(), actual.getUserId());
        assertEquals(TestFields.accountUidDto1(), actual.getAccountUid());
    }
}
