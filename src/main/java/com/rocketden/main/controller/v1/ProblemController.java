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

  /**
   * Convert the Request Body in 'x-www-form-urlencoded' format to a HashMap 
   * matching the keys to values.
   * 
   * @param bodyStr The passed-in String representing the Request Body.
   * @return HashMap<String, String> that matches the body keys to values.
   */
  public Map<String, String> bodyToMap(String bodyStr) {
    Map<String, String> body = new HashMap<>();

    // Iterate through and parse out key-value pairs.
    String[] values = bodyStr.split("&");
    for (String value : values) {
      String[] pair = value.split("=");
      if (pair.length == 2) {
        // Add the key-value pairs to the HashMap, replacing the '+' with space.
        body.put(pair[0], pair[1].replace("+", " "));
      }
    }
    return body;
  }
}
