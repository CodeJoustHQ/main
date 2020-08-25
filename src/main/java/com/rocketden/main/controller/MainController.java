package com.rocketden.main.controller;

import com.rocketden.main.dto.problem.Problem;
import com.rocketden.main.dao.problem.ProblemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

	@Autowired
	private ProblemRepository problemRepository;

	@PostMapping("/addProblem")
	public @ResponseBody Problem addNewProblem (@RequestParam String name
			, @RequestParam String description) {
		// @ResponseBody means the returned String is the response, not a view name
		// @RequestParam means it is a parameter from the GET or POST request

    // Add the problem to the database.
		Problem problem = new Problem();
		problem.setName(name);
		problem.setDescription(description);
    problemRepository.save(problem);
		return problem;
	}

	@GetMapping("/getProblems")
	public @ResponseBody Iterable<Problem> getAllProblems() {
		// Return a JSON with the problems
		return problemRepository.findAll();
	}
}
