package com.rocketden.main.controller.v1;

import com.rocketden.main.dao.problem.ProblemRepository;
import com.rocketden.main.model.Problem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProblemController extends BaseRestController {

  private ProblemRepository problemRepository;

  @Autowired
  public ProblemController(ProblemRepository problemRepository){
      this.problemRepository = problemRepository;
  }
  
  @PostMapping("/problems")
  public Problem addNewProblem (@RequestParam String name, 
    @RequestParam String description) {
        
    // Add the problem to the database, and return the problem JSON.
    Problem problem = new Problem();
    problem.setName(name);
		problem.setDescription(description);
    problemRepository.save(problem);
		return problem;
	}

	@GetMapping("/problems")
	public Iterable<Problem> getAllProblems() {
		// Return a JSON with all problems in the database.
		return problemRepository.findAll();
	}
}
