package com.codejoust.main.controller.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import com.codejoust.main.dto.problem.CreateProblemRequest;
import com.codejoust.main.dto.problem.CreateProblemTagRequest;
import com.codejoust.main.dto.problem.CreateTestCaseRequest;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemTagDto;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.model.report.CodeLanguage;
import com.codejoust.main.service.ProblemService;

@RestController
public class ProblemController extends BaseRestController {

    private final ProblemService service;

    @Autowired
    public ProblemController(ProblemService service) {
        this.service = service;
    }

    @PostMapping("/problems")
    public ResponseEntity<ProblemDto> createProblem(@RequestBody CreateProblemRequest request, @RequestHeader(name="Authorization") String token) {
        return new ResponseEntity<>(service.createProblem(request, token), HttpStatus.CREATED);

    }

    @PostMapping("/problems/{problemId}/clone")
    public ResponseEntity<ProblemDto> createProblemFromExisting(@PathVariable String problemId, @RequestHeader(name="Authorization") String token) {
        return new ResponseEntity<>(service.cloneProblem(problemId, token), HttpStatus.CREATED);
    }

    @GetMapping("/problems/{problemId}")
    public ResponseEntity<ProblemDto> getProblem(@PathVariable String problemId, @RequestHeader (name="Authorization", required = false) String token) {
        return new ResponseEntity<>(service.getProblem(problemId, token), HttpStatus.OK);
    }

    @PutMapping("/problems/{problemId}")
    public ResponseEntity<ProblemDto> editProblem(@PathVariable String problemId, @RequestBody ProblemDto updatedProblem,
                                                  @RequestHeader (name="Authorization") String token) {
        return new ResponseEntity<>(service.editProblem(problemId, updatedProblem, token), HttpStatus.OK);
    }

    @DeleteMapping("/problems/{problemId}")
    public ResponseEntity<ProblemDto> deleteProblem(@PathVariable String problemId, @RequestHeader (name="Authorization") String token) {
        return new ResponseEntity<>(service.deleteProblem(problemId, token), HttpStatus.OK);
    }


    @PostMapping("/problems/{problemId}/test-case")
    public ResponseEntity<ProblemTestCaseDto> createTestCase(@PathVariable String problemId, @RequestBody CreateTestCaseRequest request,
                                                             @RequestHeader (name="Authorization") String token) {
        return new ResponseEntity<>(service.createTestCase(problemId, request, token), HttpStatus.CREATED);
    }

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemDto>> getAllProblems(@RequestParam(required = false) Boolean verified, @RequestHeader (name="Authorization", required = false) String token) {
        return new ResponseEntity<>(service.getAllProblems(verified, token), HttpStatus.OK);
    }

    @GetMapping("/problems/{problemId}/default-code")
    public ResponseEntity<Map<CodeLanguage, String>> getDefaultCode(@PathVariable String problemId) {
        // Note: slight security issue in that anyone can access this for any problem
        return new ResponseEntity<>(service.getDefaultCode(problemId), HttpStatus.OK);
    }

    @GetMapping("/problems/tags")
    public ResponseEntity<List<ProblemTagDto>> getAllProblemTags(@RequestHeader(name="Authorization") String token) {
        return new ResponseEntity<>(service.getAllProblemTags(token), HttpStatus.OK);
    }

    @PostMapping("/problems/tags")
    public ResponseEntity<ProblemTagDto> createProblemTag(@RequestBody CreateProblemTagRequest request, @RequestHeader(name="Authorization") String token) {
        return new ResponseEntity<>(service.createProblemTag(request, token), HttpStatus.CREATED);
    }

    @DeleteMapping("/problems/tags/{tagId}")
    public ResponseEntity<ProblemTagDto> deleteProblemTag(@PathVariable String tagId, @RequestHeader(name="Authorization") String token) {
        return new ResponseEntity<>(service.deleteProblemTag(tagId, token), HttpStatus.OK);
    }
}
