package com.rocketden.main.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.exception.ProblemError;
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

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
class ProblemTests {

    @Autowired
    private MockMvc mockMvc;

    private static final String GET_PROBLEM = "/api/v1/problems/%s";
    private static final String GET_PROBLEM_ALL = "/api/v1/problems";
    private static final String POST_PROBLEM_CREATE = "/api/v1/problems";
    private static final String POST_TEST_CASE_CREATE = "/api/v1/problems/%s/test-case";

    private static final String NAME = "Sort an Array";
    private static final String DESCRIPTION = "Sort an array from lowest to highest value.";
    private static final String NAME_2 = "Find Maximum";
    private static final String DESCRIPTION_2 = "Find the maximum value in an array.";

    private static final String INPUT = "[1, 2, 8]";
    private static final String OUTPUT = "8";
    private static final String INPUT_2 = "[-1, 5, 0, 3]";
    private static final String OUTPUT_2 = "5";

    @Test
    public void getProblemNonExistent() throws Exception {
        ApiError ERROR = ProblemError.NOT_FOUND;

        MvcResult result = this.mockMvc.perform(get(String.format(GET_PROBLEM, 99)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndGetProblemSuccess() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);

        MvcResult result = this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ProblemDto actual = UtilityTestMethods.toObject(jsonResponse, ProblemDto.class);

        assertEquals(NAME, actual.getName());
        assertEquals(DESCRIPTION, actual.getDescription());
        assertEquals(0, actual.getTestCases().size());

        // Get the newly created problem from the database
        result = this.mockMvc.perform(get(String.format(GET_PROBLEM, actual.getId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        actual = UtilityTestMethods.toObject(jsonResponse, ProblemDto.class);

        assertEquals(NAME, actual.getName());
        assertEquals(DESCRIPTION, actual.getDescription());
        assertEquals(0, actual.getTestCases().size());
    }

    @Test
    public void createProblemsAndGetProblems() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);

        this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated());

        request.setName(NAME_2);
        request.setDescription(DESCRIPTION_2);

        this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
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
        assertEquals(NAME, actual.get(0).getName());
        assertEquals(DESCRIPTION, actual.get(0).getDescription());

        assertEquals(NAME_2, actual.get(1).getName());
        assertEquals(DESCRIPTION_2, actual.get(1).getDescription());
    }

    @Test
    public void createProblemEmptyFields() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);

        ApiError ERROR = ProblemError.EMPTY_FIELD;

        MvcResult result = this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
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

    @Test
    public void createTestCaseSuccess() throws Exception {
        ProblemDto problem = createSingleProblem();

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);

        String endpoint = String.format(POST_TEST_CASE_CREATE, problem.getId());
        MvcResult result = this.mockMvc.perform(post(endpoint)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ProblemTestCaseDto actual = UtilityTestMethods.toObject(jsonResponse, ProblemTestCaseDto.class);

        assertEquals(INPUT, actual.getInput());
        assertEquals(OUTPUT, actual.getOutput());
        assertFalse(actual.isHidden());
    }

    @Test
    public void createTestCaseEmptyField() throws Exception {
        ProblemDto problem = createSingleProblem();

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);

        ApiError ERROR = ProblemError.EMPTY_FIELD;

        String endpoint = String.format(POST_TEST_CASE_CREATE, problem.getId());
        MvcResult result = this.mockMvc.perform(post(endpoint)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createTestCaseProblemNotFound() throws Exception {
        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);

        ApiError ERROR = ProblemError.NOT_FOUND;

        String endpoint = String.format(POST_TEST_CASE_CREATE, 99);
        MvcResult result = this.mockMvc.perform(post(endpoint)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createProblemWithTestCasesSuccess() throws Exception {
        ProblemDto problem = createSingleProblem();

        // Create first test case
        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);
        request.setHidden(true);

        String endpoint = String.format(POST_TEST_CASE_CREATE, problem.getId());
        this.mockMvc.perform(post(endpoint)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        // Create second test case
        request.setInput(INPUT_2);
        request.setOutput(OUTPUT_2);
        request.setHidden(false);

        this.mockMvc.perform(post(endpoint)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        // Get problem from database
        MvcResult result = this.mockMvc.perform(get(String.format(GET_PROBLEM, problem.getId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ProblemDto actual = UtilityTestMethods.toObject(jsonResponse, ProblemDto.class);

        List<ProblemTestCaseDto> testCases = actual.getTestCases();
        assertEquals(2, testCases.size());

        ProblemTestCaseDto case1 = testCases.get(0);
        ProblemTestCaseDto case2 = testCases.get(1);

        assertEquals(INPUT, case1.getInput());
        assertEquals(OUTPUT, case1.getOutput());
        assertTrue(case1.isHidden());

        assertEquals(INPUT_2, case2.getInput());
        assertEquals(OUTPUT_2, case2.getOutput());
        assertFalse(case2.isHidden());
    }

    /**
     * Helper method that sends a POST request to create a new problem
     * @return the created problem
     * @throws Exception if anything wrong occurs
     */
    private ProblemDto createSingleProblem() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);

        MvcResult result = this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ProblemDto actual = UtilityTestMethods.toObject(jsonResponse, ProblemDto.class);

        assertEquals(NAME, actual.getName());
        assertEquals(DESCRIPTION, actual.getDescription());

        return actual;
    }
}
