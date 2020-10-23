package com.rocketden.main.api;

import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.exception.UserError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.util.UtilityTestMethods;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class UserTests {

    @Autowired
    private MockMvc mockMvc;

    private static final String USER_URI = "/api/v1/user";

    // Predefine user attributes.
    private static final String NICKNAME = "rocket";
    private static final String USER_ID = "012345";

    @Test
    public void createNewUser() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(NICKNAME);
        request.setUserId(USER_ID);

        UserDto expected = new UserDto();
        expected.setNickname(NICKNAME);
        expected.setUserId(USER_ID);

        MvcResult result = this.mockMvc.perform(post(USER_URI)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        UserDto actual = UtilityTestMethods.toObject(jsonResponse, UserDto.class);

        assertEquals(expected.getNickname(), actual.getNickname());
        assertEquals(expected.getUserId(), actual.getUserId());
    }

    @Test
    public void createNewUserNoUserIdSuccess() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname(NICKNAME);

        UserDto expected = new UserDto();
        expected.setNickname(NICKNAME);
        expected.setUserId(USER_ID);

        MvcResult result = this.mockMvc.perform(post(USER_URI)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        UserDto actual = UtilityTestMethods.toObject(jsonResponse, UserDto.class);

        assertEquals(expected.getNickname(), actual.getNickname());
    }

    @Test
    public void createNewUserNoNickname() throws Exception {
        CreateUserRequest request = new CreateUserRequest();

        ApiError ERROR = UserError.INVALID_USER;

        MvcResult result = this.mockMvc.perform(post(USER_URI)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createNewUserEmptyNickname() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("");

        ApiError ERROR = UserError.INVALID_USER;

        MvcResult result = this.mockMvc.perform(post(USER_URI)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createNewUserTooLongNickname() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocketrocketrocketrocket");

        ApiError ERROR = UserError.INVALID_USER;

        MvcResult result = this.mockMvc.perform(post(USER_URI)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createNewUserNicknameContainsSpaces() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket rocket");

        ApiError ERROR = UserError.INVALID_USER;

        MvcResult result = this.mockMvc.perform(post(USER_URI)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }
}
