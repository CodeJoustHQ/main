package com.rocketden.main;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class MainTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TestRestTemplate restTemplate;

	@LocalServerPort
	private int port;

	// Less extensive - mocks a REST call and checks the response
	@Test
	public void shouldReturnHelloWorld() throws Exception {
		this.mockMvc.perform(get("/api/hello").contextPath("/api")).andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("Hello, World!")));
	}

	// More extensive - loads up an actual web environment for testing
	@Test
	public void restCallShouldReturnHelloWorld() throws Exception {
		assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/api/hello",
				String.class)).contains("Hello, World!");
	}

}
