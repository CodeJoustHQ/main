package com.codejoust.main.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.lang.reflect.Type;

public class MockHelper {

    public static <T> T getRequest(MockMvc mockMvc, String url, Class<T> c, HttpStatus status) throws Exception {
        MvcResult result = mockMvc.perform(get(url)
                .header(HttpHeaders.AUTHORIZATION, TestFields.TOKEN))
                .andDo(print()).andExpect(status().is(status.value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObject(jsonResponse, c);
    }

    public static <T> T getRequest(MockMvc mockMvc, String url, Type type, HttpStatus status) throws Exception {
        MvcResult result = mockMvc.perform(get(url))
                .andDo(print()).andExpect(status().is(status.value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObjectType(jsonResponse, type);
    }

    public static <T> T postRequest(MockMvc mockMvc, String url, Object body, Class<T> c, HttpStatus status) throws Exception {
        MvcResult result = mockMvc.perform(post(url)
                .header(HttpHeaders.AUTHORIZATION, TestFields.TOKEN)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(body)))
                .andDo(print()).andExpect(status().is(status.value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObject(jsonResponse, c);
    }

    public static <T> T putRequest(MockMvc mockMvc, String url, Object body, Class<T> c, HttpStatus status) throws Exception {
        MvcResult result = mockMvc.perform(put(url)
                .header(HttpHeaders.AUTHORIZATION, TestFields.TOKEN)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(body)))
                .andDo(print()).andExpect(status().is(status.value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObject(jsonResponse, c);
    }

    public static <T> T deleteRequest(MockMvc mockMvc, String url, Object body, Class<T> c, HttpStatus status) throws Exception {
        MvcResult result = mockMvc.perform(delete(url)
                .header(HttpHeaders.AUTHORIZATION, TestFields.TOKEN)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(body)))
                .andDo(print()).andExpect(status().is(status.value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        return UtilityTestMethods.toObject(jsonResponse, c);
    }
}
