package com.rocketden.main.controller.v1;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.model.Problem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProblemController extends BaseRestController {

    private ProblemRepository problemRepository;

    @Autowired
    public ProblemController(ProblemRepository problemRepository){
        this.problemRepository = problemRepository;
    }

    @PostMapping("/problems")
    public Problem addNewProblem(@RequestBody ProblemDto problem) {
        // Map between the problem DTO and the persistent problem object.
        Problem persistentProblem = new Problem();
        persistentProblem.setName(problem.getName());
        persistentProblem.setDescription(problem.getDescription());

        // Add the problem to the database, and return the problem JSON.
        problemRepository.save(persistentProblem);
        return persistentProblem;
    }

    @PostMapping("/problems/{id}/test-case")
    public ProblemDto createTestCase(@PathVariable Integer id, CreateTestCaseRequest request) {
        // TODO
        return null;
    }

    @GetMapping("/problems")
    public Iterable<Problem> getAllProblems() {
        // Return a JSON with all problems in the database.
        return problemRepository.findAll();
    }
}
