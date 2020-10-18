package com.rocketden.main.api;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.rocketden.main.dto.problem.ProblemDto;
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

import java.util.List;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
class ProblemTests {

    // Constants to hold POST request JSON content. Initialized in constructor.
    private static ProblemDto sortArrayProblem;
    private static ProblemDto findMaxProblem;
    private static String sortArrayProblemJson;
    private static String findMaxProblemJson;

    @Autowired
    private MockMvc mockMvc;

    private static final String GET_PROBLEM_ALL = "/api/v1/problems";
    private static final String POST_PROBLEM_CREATE = "/api/v1/problems";

    /**
     * Sets up necessary test fields and fixtures.
     * (Called once before the rest of the test case methods.)
     */
    public ProblemTests() {
        // Create "Sort Array" problem JSON string.
        sortArrayProblem = new ProblemDto();
        sortArrayProblem.setName("Sort an Array");
        sortArrayProblem.setDescription
                ("Sort an array from lowest to highest value.");
        sortArrayProblemJson = UtilityTestMethods.convertObjectToJsonString(sortArrayProblem);

        // Create "Find Maximum" problem JSON string.
        findMaxProblem = new ProblemDto();
        findMaxProblem.setName("Find Maximum");
        findMaxProblem.setDescription
                ("Find the maximum value in an array.");
        findMaxProblemJson = UtilityTestMethods.convertObjectToJsonString(findMaxProblem);
    }

    @Test
    public void getProblemsEmptyList() throws Exception {
        this.mockMvc.perform(get("/api/v1/problems"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("[]")));
    }

    @Test
    public void addProblemReturnProblem() throws Exception {
        String postAddProblemReturn = "{\"id\":1,\"name\":\"Sort an Array\","
                + "\"description\":\"Sort an array from lowest to highest value.\"}";
        this.mockMvc.perform(post("/api/v1/problems")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(sortArrayProblemJson))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(postAddProblemReturn));
    }

    @Test
    public void addProblemGetProblemsOne() throws Exception {
        String getProblemsResult = "[{\"id\":1,\"name\":\"Sort an Array\","
                + "\"description\":\"Sort an array from lowest to highest value.\"}]";
        this.mockMvc.perform(post("/api/v1/problems")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(sortArrayProblemJson));
        this.mockMvc.perform(get("/api/v1/problems"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(getProblemsResult));
    }

    @Test
    public void addProblemGetProblemsTwo() throws Exception {
        String getProblemsResult = "[{\"id\":1,\"name\":\"Sort an Array\","
                + "\"description\":\"Sort an array from lowest to highest value.\"},"
                + "{\"id\":2,\"name\":\"Find Maximum\",\"description\":"
                + "\"Find the maximum value in an array.\"}]";
        this.mockMvc.perform(post("/api/v1/problems")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(sortArrayProblemJson));
        this.mockMvc.perform(post("/api/v1/problems")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(findMaxProblemJson));
        this.mockMvc.perform(get("/api/v1/problems"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(getProblemsResult)));
    }

    @Test
    @SuppressWarnings("unchecked")
    public void restCallGetProblemsEmptyList() throws Exception {
        MvcResult result = this.mockMvc.perform(get(GET_PROBLEM_ALL))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        List<ProblemDto> actual = UtilityTestMethods.toObject(jsonResponse, List.class);

        assertTrue(actual.isEmpty());
    }

}
