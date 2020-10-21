package com.rocketden.main.service;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Problem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository repository;

    @Autowired
    public ProblemService(ProblemRepository repository) {
        this.repository = repository;
    }

    public ProblemDto createProblem(CreateProblemRequest request) {
        if (request.getName() == null || request.getDescription() == null) {
            throw new ApiException(ProblemError.EMPTY_FIELD);
        }

        Problem problem = new Problem();
        problem.setName(request.getName());
        problem.setDescription(request.getDescription());

        repository.save(problem);

        return ProblemMapper.toDto(problem);
    }

    public ProblemDto getProblem(int id) {
        Problem problem = repository.findById(id)
                .orElseThrow(() -> new ApiException(ProblemError.NOT_FOUND));

        return ProblemMapper.toDto(problem);
    }

    public List<ProblemDto> getAllProblems() {
        List<ProblemDto> problems = new ArrayList<>();
        repository.findAll().forEach(problem -> problems.add(ProblemMapper.toDto(problem)));

        return problems;
    }

    public ProblemTestCaseDto createTestCase(int problemId, CreateTestCaseRequest request) {
        // TODO
        return null;
    }
}
