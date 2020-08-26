package com.rocketden.main.controller.v1;

import com.rocketden.main.dto.problem.Problem;
import com.rocketden.main.dao.problem.ProblemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProblemController extends BaseRestController {

	@Autowired
	private ProblemRepository problemRepository;
  
  @PostMapping("/addProblem")
  public @ResponseBody Problem addNewProblem (@RequestParam String name, 
    @RequestParam String description) {
        
    // Add the problem to the database, and return the problem JSON.
    Problem problem = new Problem();
    problem.setName(name);
		problem.setDescription(description);
    problemRepository.save(problem);
		return problem;
	}

	@GetMapping("/getProblems")
	public @ResponseBody Iterable<Problem> getAllProblems() {
		// Return a JSON with all problems in the database.
		return problemRepository.findAll();
	}
}
