package com.rocketden.main;

import com.rocketden.main.dto.room.JoinRoomResponse;
import com.rocketden.main.dto.user.CreateUserRequest;
import com.rocketden.main.dto.user.CreateUserResponse;
import com.rocketden.main.util.Utility;
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

    private static final String POST_USER = "/api/v1/user";

    @Test
    public void createNewUser() throws Exception {
        // PUT request to join non-existent room should fail
        CreateUserRequest request = new CreateUserRequest();
        request.setNickname("rocket");

        CreateUserResponse expected = new CreateUserResponse();
        expected.setMessage(CreateUserResponse.SUCCESS);

        MvcResult result = this.mockMvc.perform(post(POST_USER)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(Utility.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        CreateUserResponse actual = Utility.toObject(jsonResponse, CreateUserResponse.class);

        assertEquals(expected.getMessage(), actual.getMessage());
    }
}
