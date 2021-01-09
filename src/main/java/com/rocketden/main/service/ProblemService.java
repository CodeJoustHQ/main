package com.rocketden.main.service;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemTestCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
public class ProblemService {

    private final ProblemRepository repository;
    private final Random random = new Random();

    @Autowired
    public ProblemService(ProblemRepository repository) {
        this.repository = repository;
    }

    public ProblemDto createProblem(CreateProblemRequest request) {
        if (request.getName() == null || request.getDescription() == null
                || request.getDifficulty() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        if (request.getDifficulty() == ProblemDifficulty.RANDOM) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        }

        Problem problem = new Problem();
        problem.setName(request.getName());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());

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
        if (difficulty == null) {
            throw new ApiException(ProblemError.BAD_DIFFICULTY);
        } else if (numProblems == null) {
            throw new ApiException(ProblemError.BAD_NUMBER_PROBLEMS);
        }

        List<Problem> problems;
        if (difficulty == ProblemDifficulty.RANDOM) {
            problems = repository.findAll();
        } else {
            problems = repository.findAllByDifficulty(difficulty);
        }

        if (problems == null || problems.isEmpty()) {
            throw new ApiException(ProblemError.NOT_FOUND);
        }

        if (numProblems <= 0 || (numProblems > problems.size())) {
            throw new ApiException(ProblemError.INVALID_NUMBER_REQUEST);
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

        if (request.getInput() == null || request.getOutput() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(request.getInput());
        testCase.setOutput(request.getOutput());
        testCase.setHidden(request.isHidden());

        problem.addTestCase(testCase);
        repository.save(problem);

        return ProblemMapper.toTestCaseDto(testCase);
    }
}
