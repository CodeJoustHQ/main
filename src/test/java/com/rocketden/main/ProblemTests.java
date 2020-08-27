package com.rocketden.main;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import org.junit.Assert;

@SpringBootTest(
  webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
  properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource"
)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
class ProblemTests {

  // Constants to hold problem POST request content and content type details.
  private static final String urlEncodedContentType = 
    "application/x-www-form-urlencoded";
  private static final String sortArrayProblemContent = "name=Sort+an+Array&" + 
    "description=Sort+an+array+from+lowest+to+highest+value.";
  private static final String findMaxProblemContent = "name=Find+Maximum&" + 
    "description=Find+the+maximum+value+in+an+array.";

  @Autowired
  private DataSource dataSource;

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TestRestTemplate restTemplate;

  @LocalServerPort
  private int port;

  @Test
  public void hikariConnectionPoolIsConfigured() {
    Assert.assertEquals("com.zaxxer.hikari.HikariDataSource", dataSource.
      getClass().getName());
  }

  @Test
  public void getProblemsEmptyList() throws Exception {
    this.mockMvc.perform(get("/api/v1/problems"))
      .andDo(print()).andExpect(status().isOk())
      .andExpect(content().string(containsString("[]")));
  }

  @Test
  public void addProblemReturnProblem() throws Exception {
    String postAddProblemReturn = "{\"id\":1,\"name\":\"Sort an Array\","
        + "\"description\":\"Sort an array from lowest to highest value.\"}";
    this.mockMvc.perform(post("/api/v1/problems")
      .contentType(urlEncodedContentType)
      .content(sortArrayProblemContent))
      .andDo(print()).andExpect(status().isOk())
      .andExpect(content().string(postAddProblemReturn));
  }

  @Test
  public void addProblemGetProblemsOne() throws Exception {
    String getProblemsResult = "[{\"id\":1,\"name\":\"Sort an Array\","
        + "\"description\":\"Sort an array from lowest to highest value.\"}]";
    this.mockMvc.perform(post("/api/v1/problems")
      .contentType(urlEncodedContentType)
      .content(sortArrayProblemContent));
    this.mockMvc.perform(get("/api/v1/problems"))
      .andDo(print()).andExpect(status().isOk())
      .andExpect(content().string(getProblemsResult));
  }

  @Test
  public void addProblemGetProblemsTwo() throws Exception {
    String getProblemsResult = "[{\"id\":1,\"name\":\"Sort an Array\","
        + "\"description\":\"Sort an array from lowest to highest value.\"},"
        + "{\"id\":2,\"name\":\"Find Maximum\",\"description\":" + "\"Find the maximum value in an array.\"}]";
    this.mockMvc.perform(post("/api/v1/problems")
      .contentType(urlEncodedContentType)
      .content(sortArrayProblemContent));
    this.mockMvc.perform(post("/api/v1/problems")
      .contentType(urlEncodedContentType)
      .content(findMaxProblemContent));
    this.mockMvc.perform(get("/api/v1/problems"))
      .andDo(print()).andExpect(status().isOk())
      .andExpect(content().string(containsString(getProblemsResult)));
  }

  @Test
  public void restCallGetProblemsEmptyList() throws Exception {
    assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/api/v1/problems", String.class))
        .contains("[]");
  }

}
