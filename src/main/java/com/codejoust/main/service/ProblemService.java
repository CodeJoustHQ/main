package com.codejoust.main.service;

import com.codejoust.main.dao.ProblemRepository;
import com.codejoust.main.dao.ProblemTagRepository;
import com.codejoust.main.dto.problem.CreateProblemRequest;
import com.codejoust.main.dto.problem.CreateProblemTagRequest;
import com.codejoust.main.dto.problem.CreateTestCaseRequest;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemInputDto;
import com.codejoust.main.dto.problem.ProblemMapper;
import com.codejoust.main.dto.problem.ProblemTagDto;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.problem.ProblemTag;
import com.codejoust.main.model.problem.ProblemTestCase;
import com.codejoust.main.service.generators.DefaultCodeGeneratorService;
import com.codejoust.main.util.Utility;
import com.google.gson.Gson;

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

    private final ProblemRepository problemRepository;
    private final ProblemTagRepository problemTagRepository;
    private final List<DefaultCodeGeneratorService> defaultCodeGeneratorServiceList;
    private final Random random = new Random();
    private final Gson gson = new Gson();
    private static final String PROBLEM_ACCESS_PASSWORD_KEY = "PROBLEM_ACCESS_PASSWORD";

    @Autowired
    public ProblemService(ProblemRepository problemRepository, ProblemTagRepository problemTagRepository, List<DefaultCodeGeneratorService> defaultCodeGeneratorServiceList) {
        this.problemRepository = problemRepository;
        this.problemTagRepository = problemTagRepository;
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
            if (problemInput == null) {
                throw new ApiException(ProblemError.BAD_INPUT);
            } else if (!Utility.validateIdentifier(problemInput.getName())) {
                throw new ApiException(ProblemError.INVALID_VARIABLE_NAME);
            } else {
                problem.addProblemInput(ProblemMapper.toProblemInputEntity(problemInput));
            }
        }

        problemRepository.save(problem);

        return ProblemMapper.toDto(problem);
    }

    public ProblemDto getProblem(String problemId) {
        Problem problem = problemRepository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        return ProblemMapper.toDto(problem);
    }

    // Method used by game management service to fetch specific problem
    public Problem getProblemEntity(String problemId) {
        return problemRepository.findProblemByProblemId(problemId);
    }

    public ProblemDto editProblem(String problemId, ProblemDto updatedProblem) {
        Problem problem = problemRepository.findProblemByProblemId(problemId);

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
                || updatedProblem.getOutputType() == null
                || updatedProblem.getApproval() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        if (updatedProblem.getApproval() && updatedProblem.getTestCases().size() == 0) {
            throw new ApiException(ProblemError.BAD_APPROVAL);
        }

        if (updatedProblem.getDifficulty() == ProblemDifficulty.RANDOM) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        }

        problem.setName(updatedProblem.getName());
        problem.setDescription(updatedProblem.getDescription());
        problem.setDifficulty(updatedProblem.getDifficulty());
        problem.setOutputType(updatedProblem.getOutputType());
        problem.setApproval(updatedProblem.getApproval());

        problem.getProblemInputs().clear();
        for (ProblemInputDto problemInput : updatedProblem.getProblemInputs()) {
            if (!Utility.validateIdentifier(problemInput.getName())) {
                throw new ApiException(ProblemError.INVALID_VARIABLE_NAME);
            }

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

        problem.getProblemTags().clear();
        for (ProblemTagDto problemTagDto : updatedProblem.getProblemTags()) {
            if (validProblemTagName(problemTagDto.getName())) {
                ProblemTag problemTag = new ProblemTag();
                problemTag.setName(problemTagDto.getName());
                problem.addProblemTag(problemTag);
            }
        }

        problemRepository.save(problem);

        return ProblemMapper.toDto(problem);
    }

    public ProblemDto deleteProblem(String problemId) {
        Problem problem = problemRepository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        problemRepository.delete(problem);

        return ProblemMapper.toDto(problem);
    }

    public List<ProblemDto> getAllProblems(Boolean approved) {
        List<ProblemDto> problems = new ArrayList<>();
        if (approved != null && approved) {
            problemRepository.findAllByApproval(true).forEach(problem -> problems.add(ProblemMapper.toDto(problem)));
        } else {
            problemRepository.findAll().forEach(problem -> problems.add(ProblemMapper.toDto(problem)));
        }

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

        if (numProblems <= 0) {
            throw new ApiException(ProblemError.INVALID_NUMBER_REQUEST);
        }

        List<Problem> problems;
        if (difficulty == ProblemDifficulty.RANDOM) {
            problems = problemRepository.findAllByApproval(true);
        } else {
            problems = problemRepository.findAllByDifficultyAndApproval(difficulty, true);
        }

        if (problems == null) {
            throw new ApiException(ProblemError.INTERNAL_ERROR);
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
        Problem problem = problemRepository.findProblemByProblemId(problemId);
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
        problemRepository.save(problem);

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
                throw new ApiException(ProblemError.INVALID_INPUT);
            }

        } catch (Exception e) {
            throw new ApiException(ProblemError.INVALID_INPUT);
        }
    }
    
    public Map<CodeLanguage, String> getDefaultCode(String problemId) {
        // Convert from the Problem object to Problem DTOs.
        Problem problem = problemRepository.findProblemByProblemId(problemId);

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
            defaultCodeMap.put(language, defaultCode.replace("\t", "    "));
        }

        return defaultCodeMap;
    }

    public List<ProblemTagDto> getProblemTags(String problemId) {
        // TODO: There's a chance this method isn't necessary.
        Problem problem = problemRepository.findProblemByProblemId(problemId);

        if (problem == null) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        List<ProblemTagDto> problemTagDtos = new ArrayList<>();
        problem.getProblemTags().forEach(problemTag -> problemTagDtos.add(ProblemMapper.toProblemTagDto(problemTag)));
        return problemTagDtos;
    }

    public List<ProblemTagDto> getAllProblemTags() {
        List<ProblemTag> problemTags = problemTagRepository.findAll();

        // If the problem does not have any ProblemTags, return empty list.
        if (problemTags == null) {
            // TODO: Is the result null if the problem doesn't have tags?
            return new ArrayList<ProblemTagDto>();
        }

        List<ProblemTagDto> problemTagDtos = new ArrayList<>();
        problemTags.forEach(problemTag -> problemTagDtos.add(ProblemMapper.toProblemTagDto(problemTag)));
        return problemTagDtos;
    }

    public ProblemTagDto createProblemTag(CreateProblemTagRequest request) {
        ProblemTag existingProblemTag = problemTagRepository.findProblemTagByName(request.getName());

        // Handle invalid request, with restraints on the length of the name.
        if (!validProblemTagName(request.getName())) {
            throw new ApiException(ProblemError.BAD_PROBLEM_TAG);
        }

        // Do not create the new problem tag if one with this name exists.
        if (existingProblemTag != null) {
            throw new ApiException(ProblemError.TAG_NAME_ALREADY_EXISTS);
        }

        // Add the problem tag to the database.
        ProblemTag problemTag = new ProblemTag();
        problemTag.setName(request.getName());
        problemTagRepository.save(problemTag);
        return ProblemMapper.toProblemTagDto(problemTag);
    }

    public ProblemTagDto deleteProblemTag(String tagId) {
        ProblemTag problemTag = problemTagRepository.findTagByTagId(tagId);

        // Do not create the new problem tag if one with this name exists.
        if (problemTag == null) {
            throw new ApiException(ProblemError.TAG_NAME_NOT_FOUND);
        }

        // Remove the problem tag from the database.
        ProblemTagDto problemTagDto = ProblemMapper.toProblemTagDto(problemTag);
        problemTagRepository.delete(problemTag);
        return problemTagDto;
    }

    private boolean validProblemTagName(String name) {
        return name != null && name.length() > 0 && name.length() < 20;
    }

    /**
     * This method is used in a GET request to see if users can access the
     * problem pages on the frontend. The parameter is compared against the
     * problem access password environment variable; if no environment variable
     * is set, then it returns false.
     * 
     * @param password the password supplied by the user
     * @return true iff the password supplied by the user matches the set system
     * password, false otherwise
     */
    public Boolean accessProblems(String password) {
        return System.getenv(PROBLEM_ACCESS_PASSWORD_KEY) != null
            && password.equals(System.getenv(PROBLEM_ACCESS_PASSWORD_KEY));
    }
}
