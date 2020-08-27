package com.rocketden.main.controller.v1;

import java.util.HashMap;
import java.util.Map;

import com.rocketden.main.dao.problem.ProblemRepository;
import com.rocketden.main.model.Problem;
import com.rocketden.main.util.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class ProblemController extends BaseRestController {

  // Create key constants for request body from POST.
  private final String ADD_NEW_PROBLEM_NAME_KEY = "name";
  private final String ADD_NEW_PROBLEM_DESCRIPTION_KEY = "description";

  private ProblemRepository problemRepository;

  @Autowired
  public ProblemController(ProblemRepository problemRepository){
      this.problemRepository = problemRepository;
  }
  
  @PostMapping("/problems")
  public Problem addNewProblem (@RequestBody String bodyStr) {
    // Get and parse the parameters from the Request Body.
    Map<String, String> body = Utility.bodyToMap(bodyStr);
    String name = body.get(ADD_NEW_PROBLEM_NAME_KEY);
    String description = body.get(ADD_NEW_PROBLEM_DESCRIPTION_KEY);
        
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
