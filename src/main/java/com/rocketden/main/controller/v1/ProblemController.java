package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;

import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProblemController extends BaseRestController {

    private final ProblemService service;

    @Autowired
    public ProblemController(ProblemService service) {
        this.service = service;
    }

    @PostMapping("/problems")
    public ResponseEntity<ProblemDto> createProblem(@RequestBody CreateProblemRequest request) {
        return new ResponseEntity<>(service.createProblem(request), HttpStatus.CREATED);

    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<ProblemDto> getProblem(@PathVariable Integer id) {
        return new ResponseEntity<>(service.getProblem(id), HttpStatus.OK);
    }

    @PostMapping("/problems/{id}/test-case")
    public ResponseEntity<ProblemTestCaseDto> createTestCase(@PathVariable Integer id, CreateTestCaseRequest request) {
        return new ResponseEntity<>(service.createTestCase(id, request), HttpStatus.CREATED);
    }

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemDto>> getAllProblems() {
        return new ResponseEntity<>(service.getAllProblems(), HttpStatus.OK);
    }
}
