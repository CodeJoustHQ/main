package com.rocketden.main.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.util.UtilityTestMethods;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
class ProblemTests {

    private static ProblemDto problem1;
    private static ProblemDto problem2;

    @Autowired
    private MockMvc mockMvc;

    private static final String GET_PROBLEM_ALL = "/api/v1/problems";
    private static final String POST_PROBLEM_CREATE = "/api/v1/problems";

    @BeforeEach
    public void setup() {
        problem1 = new ProblemDto();
        problem1.setName("Sort an Array");
        problem1.setDescription("Sort an array from lowest to highest value.");

        problem2 = new ProblemDto();
        problem2.setName("Find Maximum");
        problem2.setDescription("Find the maximum value in an array.");
    }

    @Test
    public void createProblemSuccess() throws Exception {
        MvcResult result = this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(problem1)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ProblemDto actual = UtilityTestMethods.toObject(jsonResponse, ProblemDto.class);

        assertEquals(problem1.getName(), actual.getName());
        assertEquals(problem1.getDescription(), actual.getDescription());
    }

    @Test
    public void createProblemsAndGetProblems() throws Exception {
        this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(problem1)))
                .andDo(print()).andExpect(status().isCreated());

        this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(problem2)))
                .andDo(print()).andExpect(status().isCreated());

        // After creating two problems, check that the GET request finds them all
        MvcResult result = this.mockMvc.perform(get(GET_PROBLEM_ALL))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        // Special conversion process for lists of generic type
        String jsonResponse = result.getResponse().getContentAsString();
        Type listType = new TypeToken<ArrayList<ProblemDto>>(){}.getType();
        List<ProblemDto> actual = new Gson().fromJson(jsonResponse, listType);

        assertEquals(2, actual.size());
        assertEquals(problem1.getName(), actual.get(0).getName());
        assertEquals(problem1.getDescription(), actual.get(0).getDescription());

        assertEquals(problem2.getName(), actual.get(1).getName());
        assertEquals(problem2.getDescription(), actual.get(1).getDescription());
    }

    @Test
    public void getProblemsEmptyList() throws Exception {
        MvcResult result = this.mockMvc.perform(get(GET_PROBLEM_ALL))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        Type listType = new TypeToken<ArrayList<ProblemDto>>(){}.getType();
        List<ProblemDto> actual = new Gson().fromJson(jsonResponse, listType);

        assertTrue(actual.isEmpty());
    }

}
