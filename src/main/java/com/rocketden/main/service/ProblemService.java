package com.rocketden.main.service;

import com.google.gson.Gson;
import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemInputDto;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemIOType;
import com.rocketden.main.model.problem.ProblemInput;
import com.rocketden.main.model.problem.ProblemTestCase;
import com.rocketden.main.service.generators.DefaultCodeGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    private final ProblemRepository repository;
    private final List<DefaultCodeGeneratorService> defaultCodeGeneratorServiceList;
    private final Random random = new Random();
    private final Gson gson = new Gson();

    @Autowired
    public ProblemService(ProblemRepository repository, List<DefaultCodeGeneratorService> defaultCodeGeneratorServiceList) {
        this.repository = repository;
        this.defaultCodeGeneratorServiceList = defaultCodeGeneratorServiceList;
    }

    public ProblemDto createProblem(CreateProblemRequest request) {
        if (request.getName() == null || request.getDescription() == null
                || request.getName().isEmpty() || request.getDescription().isEmpty()
                || request.getDifficulty() == null
                || request.getProblemInputs() == null
                || request.getOutputType() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        if (request.getDifficulty() == ProblemDifficulty.RANDOM) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        }

        Problem problem = new Problem();
        problem.setName(request.getName());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setOutputType(request.getOutputType());

        // Add all problem inputs in list.
        for (ProblemInputDto problemInput : request.getProblemInputs()) {
            if (problemInput != null) {
                problem.addProblemInput(ProblemMapper.toProblemInputEntity(problemInput));
            } else {
                throw new ApiException(ProblemError.BAD_INPUT);
            }
        }

        repository.save(problem);

        return ProblemMapper.toDto(problem);
    }

    public ProblemDto getProblem(String problemId) {
        Problem problem = repository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        return ProblemMapper.toDto(problem);
    }

    // Method used by game management service to fetch specific problem
    public Problem getProblemEntity(String problemId) {
        return repository.findProblemByProblemId(problemId);
    }

    public ProblemDto editProblem(String problemId, ProblemDto updatedProblem) {
        Problem problem = repository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        if (updatedProblem == null || updatedProblem.getName() == null
                || updatedProblem.getDescription() == null
                || updatedProblem.getName().isEmpty()
                || updatedProblem.getDescription().isEmpty()
                || updatedProblem.getDifficulty() == null
                || updatedProblem.getProblemInputs() == null
                || updatedProblem.getTestCases() == null
                || updatedProblem.getOutputType() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        if (updatedProblem.getDifficulty() == ProblemDifficulty.RANDOM) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        }

        problem.setName(updatedProblem.getName());
        problem.setDescription(updatedProblem.getDescription());
        problem.setDifficulty(updatedProblem.getDifficulty());
        problem.setOutputType(updatedProblem.getOutputType());

        problem.getProblemInputs().clear();
        for (ProblemInputDto problemInput : updatedProblem.getProblemInputs()) {
            problem.addProblemInput(ProblemMapper.toProblemInputEntity(problemInput));
        }

        problem.getTestCases().clear();
        for (ProblemTestCaseDto testCaseDto : updatedProblem.getTestCases()) {
            // Ensure that the user entered valid inputs and outputs for the problem
            validateInputsGsonParseable(testCaseDto.getInput(), updatedProblem.getProblemInputs());
            validateGsonParseable(testCaseDto.getOutput(), updatedProblem.getOutputType());

            ProblemTestCase testCase = new ProblemTestCase();
            testCase.setInput(testCaseDto.getInput());
            testCase.setOutput(testCaseDto.getOutput());
            testCase.setHidden(testCaseDto.isHidden());
            testCase.setExplanation(testCaseDto.getExplanation());

            problem.addTestCase(testCase);
        }

        repository.save(problem);

        return ProblemMapper.toDto(problem);
    }

    public ProblemDto deleteProblem(String problemId) {
        Problem problem = repository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        repository.delete(problem);

        return ProblemMapper.toDto(problem);
    }

    public List<ProblemDto> getAllProblems() {
        List<ProblemDto> problems = new ArrayList<>();
        repository.findAll().forEach(problem -> problems.add(ProblemMapper.toDto(problem)));

        return problems;
    }

    /**
     * Get a list of random problems with the provided parameters.
     * 
     * @param difficulty The problem difficulty the problems must match.
     * @param numProblems The number of problems to fetch.
     */
    public List<Problem> getProblemsFromDifficulty(ProblemDifficulty difficulty, Integer numProblems) {
        if (difficulty == null || numProblems == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        List<Problem> problems;
        if (difficulty == ProblemDifficulty.RANDOM) {
            problems = repository.findAll();
        } else {
            problems = repository.findAllByDifficulty(difficulty);
        }

        if (problems == null) {
            throw new ApiException(ProblemError.INTERNAL_ERROR);
        }

        if (numProblems <= 0) {
            throw new ApiException(ProblemError.INVALID_NUMBER_REQUEST);
        }

        // If the user wants more problems than exists, throw an error
        if (numProblems > problems.size()) {
            throw new ApiException(ProblemError.NOT_ENOUGH_FOUND);
        }

        // Get numProblem random integers used to map to problems.
        Set<Integer> randomIntegers = new HashSet<>();
        while (randomIntegers.size() < numProblems) {
            randomIntegers.add(random.nextInt(problems.size()));
        }

        // Get the numProblem problems mapped to those integers.
        List<Problem> chosenProblems = new ArrayList<>();
        for (Integer i : randomIntegers) {
            chosenProblems.add(problems.get(i));
        }

        return chosenProblems;
    }

    public ProblemTestCaseDto createTestCase(String problemId, CreateTestCaseRequest request) {
        Problem problem = repository.findProblemByProblemId(problemId);
        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        // Problem input and output are the two required fields.
        if (request.getInput() == null || request.getOutput() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        // Verify inputs are of valid form
        List<ProblemInputDto> inputs = problem.getProblemInputs()
                .stream()
                .map(ProblemMapper::toProblemInputDto)
                .collect(Collectors.toList());

        validateInputsGsonParseable(request.getInput(), inputs);
        validateGsonParseable(request.getOutput(), problem.getOutputType());


        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(request.getInput());
        testCase.setOutput(request.getOutput());

        // Test case is not hidden by default.
        testCase.setHidden(request.isHidden());

        // Explanation may be null, indicating no explanation is attached.
        testCase.setExplanation(request.getExplanation());

        problem.addTestCase(testCase);
        repository.save(problem);

        return ProblemMapper.toTestCaseDto(testCase);
    }

    // Check to make sure test case inputs and outputs are Gson-parsable
    protected void validateInputsGsonParseable(String input, List<ProblemInputDto> types) {
        if (input == null) {
            throw new ApiException(ProblemError.INVALID_INPUT);
        }

        // Each parameter input should be on a separate line
        String[] inputs = input.trim().split("\n");
        if (inputs.length != types.size()) {
            throw new ApiException(ProblemError.INCORRECT_INPUT_COUNT);
        }

        for (int i = 0; i < types.size(); i++) {
            ProblemInputDto type = types.get(i);
            if (type == null || type.getName() == null || type.getName().isEmpty() || type.getType() == null) {
                throw new ApiException(ProblemError.BAD_INPUT);
            }

            validateGsonParseable(inputs[i], types.get(i).getType());
        }
    }

    private void validateGsonParseable(String input, ProblemIOType type) {
        if (input == null) {
            throw new ApiException(ProblemError.INVALID_INPUT);
        }

        try {
            Object result = gson.fromJson(input, type.getClassType());

            // Trigger catch block to return invalid input error
            if (result == null) {
                throw new Exception();
            }

        } catch (Exception e) {
            throw new ApiException(ProblemError.INVALID_INPUT);
        }
    }
    public Map<CodeLanguage, String> getDefaultCode(String problemId) {
        // Convert from the Problem object to Problem DTOs.
        Problem problem = repository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }
        
        Map<CodeLanguage, String> defaultCodeMap = new EnumMap<>(CodeLanguage.class);
        
        // Get the relevant problem type information.
        List<ProblemInput> problemInputs = problem.getProblemInputs();
        ProblemIOType outputType = problem.getOutputType();

        // Loop through all default code generators, and add them to EnumMap.
        for (DefaultCodeGeneratorService defaultCodeGeneratorService : defaultCodeGeneratorServiceList) {
            CodeLanguage language = defaultCodeGeneratorService.getLanguage();
            String defaultCode = defaultCodeGeneratorService.getDefaultCode(problemInputs, outputType);
            // Replace tabs with spaces
            defaultCodeMap.put(language, defaultCode.replaceAll("\t", "    "));
        }

        return defaultCodeMap;
    }   
}
