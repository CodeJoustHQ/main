package com.rocketden.main.util;

import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemInputDto;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemIOType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ProblemTestMethods {

    private static final String POST_PROBLEM_CREATE = "/api/v1/problems";

    private static final String NAME = "Sort an Array";
    private static final String DESCRIPTION = "Sort an array from lowest to highest value.";
    private static final String INPUT_NAME = "nums";
    private static final ProblemIOType IO_TYPE = ProblemIOType.ARRAY_INTEGER;

    /**
     * Helper method that sends a POST request to create a new problem
     * @return the created problem
     * @throws Exception if anything wrong occurs
     */
    public static ProblemDto createSingleProblem(MockMvc mockMvc) throws Exception {
        CreateProblemRequest createProblemRequest = new CreateProblemRequest();
        createProblemRequest.setName(NAME);
        createProblemRequest.setDescription(DESCRIPTION);
        createProblemRequest.setDifficulty(ProblemDifficulty.EASY);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        createProblemRequest.setProblemInputs(problemInputs);
        createProblemRequest.setOutputType(IO_TYPE);

        MvcResult problemResult = mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createProblemRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String problemJsonResponse = problemResult.getResponse().getContentAsString();
        ProblemDto problemActual = UtilityTestMethods.toObject(problemJsonResponse, ProblemDto.class);

        assertEquals(NAME, problemActual.getName());
        assertEquals(DESCRIPTION, problemActual.getDescription());
        assertEquals(createProblemRequest.getDifficulty(), problemActual.getDifficulty());
        assertEquals(problemInputs, problemActual.getProblemInputs());
        assertEquals(IO_TYPE, problemActual.getOutputType());

        return problemActual;
    }
}
