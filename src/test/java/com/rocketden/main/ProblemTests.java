package com.rocketden.main;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
class ProblemTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TestRestTemplate restTemplate;

	@LocalServerPort
  private int port;
  
  // Constants for common POST requests.
  private final String postAddProblemRequestOne = "/api/v1/addProblem?name=" +
    "Sort an Array&description=Sort an array from lowest to highest value.";
  private final String postAddProblemRequestTwo = "/api/v1/addProblem?name=" +
    "Find Maximum&description=Find the maximum value in an array.";

	@Test
	public void getProblemsEmptyList() throws Exception {
		this.mockMvc.perform(get("/api/v1/getProblems")).andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("[]")));
  }
  
	@Test
	public void addProblemReturnProblem() throws Exception {
    String postAddProblemReturn = "{\"id\":1,\"name\":\"Sort an Array\"," +
      "\"description\":\"Sort an array from lowest to highest value.\"}";
		this.mockMvc.perform(post(postAddProblemRequestOne)).andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().string(postAddProblemReturn));
  }
  
  @Test
	public void addProblemGetProblemsOne() throws Exception {
    String getProblemsResult = "[{\"id\":1,\"name\":\"Sort an Array\"," +
      "\"description\":\"Sort an array from lowest to highest value.\"}]";
    this.mockMvc.perform(post(postAddProblemRequestOne));
    this.mockMvc.perform(get("/api/v1/getProblems")).andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().string(getProblemsResult));
  }
  
  @Test
	public void addProblemGetProblemsTwo() throws Exception {
    String getProblemsResult = "[{\"id\":1,\"name\":\"Sort an Array\"," +
      "\"description\":\"Sort an array from lowest to highest value.\"}," + 
      "{\"id\":2,\"name\":\"Find Maximum\",\"description\":" +
      "\"Find the maximum value in an array.\"}]";
    this.mockMvc.perform(post(postAddProblemRequestOne));
    this.mockMvc.perform(post(postAddProblemRequestTwo));
    this.mockMvc.perform(get("/api/v1/getProblems")).andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().string(containsString(getProblemsResult)));
	}

	@Test
	public void restCallGetProblemsEmptyList() throws Exception {
		assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/api/v1/getProblems",
				String.class)).contains("[]");
  }

}
