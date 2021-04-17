package com.rocketden.main.util;

import com.rocketden.main.exception.api.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MockHelper {

    public static <T> T getRequest(MockMvc mockMvc, String url, Class<T> c, HttpStatus status) throws Exception {
        MvcResult result = mockMvc.perform(get(url))
                .andDo(print()).andExpect(status().is(status.value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObject(jsonResponse, c);
    }
}
