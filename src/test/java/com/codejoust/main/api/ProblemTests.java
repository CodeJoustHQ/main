package com.codejoust.main.api;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.codejoust.main.dto.problem.CreateProblemRequest;
import com.codejoust.main.dto.problem.CreateTestCaseRequest;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemInputDto;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.util.MockHelper;
import com.codejoust.main.util.ProblemTestMethods;
import com.codejoust.main.util.TestUrls;
import com.codejoust.main.util.UtilityTestMethods;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
class ProblemTests {

    @Autowired
    private MockMvc mockMvc;

    private static final String DIFFICULTY_KEY = "difficulty";
    private static final String NUM_PROBLEMS_KEY = "numProblems";

    private static final String NAME = "Sort an Array";
    private static final String DESCRIPTION = "Sort an array from lowest to highest value.";
    private static final String NAME_2 = "Find Maximum";
    private static final String DESCRIPTION_2 = "Find the maximum value in an array.";

    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";
    private static final String EXPLANATION = "2 < 8, so those are swapped.";
    private static final String INPUT_2 = "[-1, 5, 0, 3]";
    private static final String OUTPUT_2 = "[-1, 0, 3, 5]";
    private static final String EXPLANATION_2 = "5 is the largest, so it should be at the end.";
    private static final String INPUT_NAME = "nums";
    private static final ProblemIOType IO_TYPE = ProblemIOType.ARRAY_INTEGER;

    private static final String javaDefaultCode = String.join("\n",
        "import java.util.*;",
        "",
        "public class Solution {",
        "\tpublic int[] solve(int[] nums) {",
        "\t\t",
        "\t}",
        "}",
        ""
    ).replaceAll("\t", "    ");

    public static final String pythonDefaultCode = String.join("\n",
        "class Solution(object):",
        "\tdef solve(nums):",
        "\t\t"
    ).replaceAll("\t", "    ");

    @Test
    public void getProblemNonExistent() throws Exception {
        ApiError ERROR = ProblemError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.getRequest(this.mockMvc, TestUrls.getProblem("999"), ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createAndGetProblemSuccess() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.MEDIUM);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        ProblemDto actual = MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), request, ProblemDto.class, HttpStatus.CREATED);

        assertEquals(NAME, actual.getName());
        assertEquals(DESCRIPTION, actual.getDescription());
        assertEquals(0, actual.getTestCases().size());
        assertEquals(problemInputs, actual.getProblemInputs());
        assertEquals(IO_TYPE, actual.getOutputType());

        // Get the newly created problem from the database
        actual = MockHelper.getRequest(this.mockMvc, TestUrls.getProblem(actual.getProblemId()), ProblemDto.class, HttpStatus.OK);

        assertEquals(NAME, actual.getName());
        assertEquals(DESCRIPTION, actual.getDescription());
        assertEquals(request.getDifficulty(), actual.getDifficulty());
        assertEquals(0, actual.getTestCases().size());
    }

    @Test
    public void createProblemsAndGetProblems() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), request, ProblemDto.class, HttpStatus.CREATED);

        request.setName(NAME_2);
        request.setDescription(DESCRIPTION_2);
        MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), request, ProblemDto.class, HttpStatus.CREATED);

        // After creating two problems, check that the GET request finds them all
        MvcResult result = this.mockMvc.perform(get(TestUrls.getAllProblems()))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        // Special conversion process for lists of generic type
        String jsonResponse = result.getResponse().getContentAsString();
        Type listType = new TypeToken<ArrayList<ProblemDto>>(){}.getType();
        List<ProblemDto> actual = new Gson().fromJson(jsonResponse, listType);

        assertEquals(2, actual.size());
        assertEquals(NAME, actual.get(0).getName());
        assertEquals(DESCRIPTION, actual.get(0).getDescription());
        assertEquals(problemInputs, actual.get(0).getProblemInputs());
        assertEquals(IO_TYPE, actual.get(0).getOutputType());

        assertEquals(NAME_2, actual.get(1).getName());
        assertEquals(DESCRIPTION_2, actual.get(1).getDescription());
        assertEquals(problemInputs, actual.get(1).getProblemInputs());
        assertEquals(IO_TYPE, actual.get(1).getOutputType());
    }

    @Test
    public void createEditDeleteProblemSuccess() throws Exception {
        ProblemDto problemDto = ProblemTestMethods.createSingleProblem(this.mockMvc);
        problemDto.setOutputType(ProblemIOType.CHARACTER);
        problemDto.setName(NAME_2);

        ProblemTestCaseDto testCaseDto = new ProblemTestCaseDto();
        testCaseDto.setInput(INPUT);
        testCaseDto.setOutput("a");
        problemDto.setTestCases(Collections.singletonList(testCaseDto));

        // Edit problem with new values
        MockHelper.putRequest(this.mockMvc, TestUrls.editProblem(problemDto.getProblemId()), problemDto, ProblemDto.class, HttpStatus.OK);

        // Perform GET request to ensure updated problem is saved
        ProblemDto actual = MockHelper.getRequest(this.mockMvc, TestUrls.getProblem(problemDto.getProblemId()), ProblemDto.class, HttpStatus.OK);

        assertEquals(problemDto.getOutputType(), actual.getOutputType());
        assertEquals(problemDto.getName(), actual.getName());
        assertEquals(problemDto.getTestCases().get(0).getOutput(), actual.getTestCases().get(0).getOutput());

        // Delete problem from the database
        MockHelper.deleteRequest(this.mockMvc, TestUrls.deleteProblem(problemDto.getProblemId()), null, ProblemDto.class, HttpStatus.OK);

        ApiError ERROR = ProblemError.NOT_FOUND;

        // Ensure that the GET request throws a not found error
        ApiErrorResponse response = MockHelper.getRequest(this.mockMvc, TestUrls.getProblem(problemDto.getProblemId()), ApiErrorResponse.class, ERROR.getStatus());

        assertEquals(ERROR.getResponse(), response);
    }

    @ParameterizedTest
    @ValueSource(strings = {"finally", "void", "throw", "EP<>", "new"})
    public void editProblemInvalidIdentifier(String inputName) throws Exception {
        ProblemDto problemDto = ProblemTestMethods.createSingleProblem(this.mockMvc);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto();
        problemInput.setName(inputName);
        problemInput.setType(ProblemIOType.STRING);
        problemInputs.add(problemInput);
        problemDto.setProblemInputs(problemInputs);

        ApiError ERROR = ProblemError.INVALID_VARIABLE_NAME;

        // Edit problem with new values
        ApiErrorResponse actual = MockHelper.putRequest(this.mockMvc, TestUrls.editProblem(problemDto.getProblemId()), problemDto, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createProblemBadInput() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        problemInputs.add(null);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        ApiError ERROR = ProblemError.BAD_INPUT;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @ParameterizedTest
    @ValueSource(strings = {"False", "try", "jeremy ", "-minus", "@annotation"})
    public void createProblemInvalidIdentifier(String inputName) throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDescription(DESCRIPTION);
        request.setDifficulty(ProblemDifficulty.HARD);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto();
        problemInput.setName(inputName);
        problemInput.setType(ProblemIOType.STRING);
        problemInputs.add(problemInput);
        request.setProblemInputs(problemInputs);
        request.setOutputType(IO_TYPE);

        ApiError ERROR = ProblemError.INVALID_VARIABLE_NAME;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createProblemEmptyFields() throws Exception {
        CreateProblemRequest request = new CreateProblemRequest();
        request.setName(NAME);
        request.setDifficulty(ProblemDifficulty.HARD);

        ApiError ERROR = ProblemError.EMPTY_FIELD;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createProblemBadDifficulty() throws Exception {
        String jsonRequest = "{\"name\": \"Test\", \"description\": \"Do this\", \"difficulty\": \"invalid\", \"problemInputs\": [{\"name\": \"nums\", \"type\": \"java\"}], \"outputType\": \"java\"}";

        ApiError ERROR = ProblemError.BAD_DIFFICULTY;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createProblem(), jsonRequest, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void getProblemsEmptyList() throws Exception {
        MvcResult result = this.mockMvc.perform(get(TestUrls.getAllProblems()))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        Type listType = new TypeToken<ArrayList<ProblemDto>>(){}.getType();
        List<ProblemDto> actual = new Gson().fromJson(jsonResponse, listType);

        assertTrue(actual.isEmpty());
    }

    @Test
    public void createTestCaseSuccess() throws Exception {
        ProblemDto problem = ProblemTestMethods.createSingleProblem(this.mockMvc);

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);
        request.setExplanation(EXPLANATION);

        ProblemTestCaseDto actual = MockHelper.postRequest(this.mockMvc, TestUrls.createTestcase(problem.getProblemId()), request, ProblemTestCaseDto.class, HttpStatus.CREATED);

        assertEquals(INPUT, actual.getInput());
        assertEquals(OUTPUT, actual.getOutput());
        assertEquals(EXPLANATION, actual.getExplanation());
        assertFalse(actual.isHidden());
    }

    @Test
    public void createTestCaseNoExplanationSuccess() throws Exception {
        ProblemDto problem = ProblemTestMethods.createSingleProblem(this.mockMvc);

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);

        ProblemTestCaseDto actual = MockHelper.postRequest(this.mockMvc, TestUrls.createTestcase(problem.getProblemId()), request, ProblemTestCaseDto.class, HttpStatus.CREATED);

        assertEquals(INPUT, actual.getInput());
        assertEquals(OUTPUT, actual.getOutput());
        assertNull(actual.getExplanation());
        assertFalse(actual.isHidden());
    }

    @Test
    public void createTestCaseEmptyField() throws Exception {
        ProblemDto problem = ProblemTestMethods.createSingleProblem(this.mockMvc);

        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);

        ApiError ERROR = ProblemError.EMPTY_FIELD;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createTestcase(problem.getProblemId()), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createTestCaseProblemNotFound() throws Exception {
        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);
        request.setExplanation(EXPLANATION);

        ApiError ERROR = ProblemError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.postRequest(this.mockMvc, TestUrls.createTestcase("99"), request, ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void createProblemWithTestCasesSuccess() throws Exception {
        ProblemDto problem = ProblemTestMethods.createSingleProblem(this.mockMvc);

        // Create first test case
        CreateTestCaseRequest request = new CreateTestCaseRequest();
        request.setInput(INPUT);
        request.setOutput(OUTPUT);
        request.setExplanation(EXPLANATION);
        request.setHidden(true);

        MockHelper.postRequest(this.mockMvc, TestUrls.createTestcase(problem.getProblemId()), request, ProblemTestCaseDto.class, HttpStatus.CREATED);

        // Create second test case
        request.setInput(INPUT_2);
        request.setOutput(OUTPUT_2);
        request.setExplanation(EXPLANATION_2);
        request.setHidden(false);

        MockHelper.postRequest(this.mockMvc, TestUrls.createTestcase(problem.getProblemId()), request, ProblemTestCaseDto.class, HttpStatus.CREATED);

        // Get problem from database
        ProblemDto actual = MockHelper.getRequest(this.mockMvc, TestUrls.getProblem(problem.getProblemId()), ProblemDto.class, HttpStatus.OK);

        List<ProblemTestCaseDto> testCases = actual.getTestCases();
        assertEquals(2, testCases.size());

        ProblemTestCaseDto case1 = testCases.get(0);
        ProblemTestCaseDto case2 = testCases.get(1);

        assertEquals(INPUT, case1.getInput());
        assertEquals(OUTPUT, case1.getOutput());
        assertEquals(EXPLANATION, case1.getExplanation());
        assertTrue(case1.isHidden());

        assertEquals(INPUT_2, case2.getInput());
        assertEquals(OUTPUT_2, case2.getOutput());
        assertEquals(EXPLANATION_2, case2.getExplanation());
        assertFalse(case2.isHidden());
    }

    @Test
    public void getRandomProblemSuccess() throws Exception {
        ProblemDto problem = ProblemTestMethods.createSingleApprovedProblemAndTestCases(this.mockMvc);

        MvcResult result = this.mockMvc.perform(get(TestUrls.getRandomProblem())
                .param(DIFFICULTY_KEY, "EASY")
                .param(NUM_PROBLEMS_KEY, "1"))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        List<ProblemDto> actual = UtilityTestMethods.toObjectType(jsonResponse, new TypeToken<List<ProblemDto>>(){}.getType());

        assertEquals(problem.getName(), actual.get(0).getName());
        assertEquals(problem.getDescription(), actual.get(0).getDescription());
        assertEquals(ProblemDifficulty.EASY, actual.get(0).getDifficulty());
        assertEquals(problem.getProblemId(), actual.get(0).getProblemId());
        assertEquals(problem.getTestCases(), actual.get(0).getTestCases());
    }

    @Test
    public void getRandomProblemNotFound() throws Exception {
        ApiError ERROR = ProblemError.NOT_ENOUGH_FOUND;

        MvcResult result = this.mockMvc.perform(get(TestUrls.getRandomProblem())
                .param(DIFFICULTY_KEY, "MEDIUM")
                .param(NUM_PROBLEMS_KEY, "1"))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }

    @Test
    public void getDefaultCodeSuccess() throws Exception {
        ProblemDto problem = ProblemTestMethods.createSingleProblem(this.mockMvc);

        MvcResult result = this.mockMvc.perform(get(TestUrls.getDefaultCode(problem.getProblemId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        Map<CodeLanguage, String> actual = UtilityTestMethods.toObjectType(jsonResponse, new TypeToken<Map<CodeLanguage, String>>(){}.getType());

        assertEquals(javaDefaultCode, actual.get(CodeLanguage.JAVA));
        assertEquals(pythonDefaultCode, actual.get(CodeLanguage.PYTHON));
        assertEquals(2, actual.size());
    }

    @Test
    public void getDefaultCodeProblemNotFound() throws Exception {
        ApiError ERROR = ProblemError.NOT_FOUND;

        ApiErrorResponse actual = MockHelper.getRequest(this.mockMvc, TestUrls.getDefaultCode("999999"), ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }
}
