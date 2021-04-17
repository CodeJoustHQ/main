package com.codejoust.main.api;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import com.codejoust.main.util.UtilityTestMethods;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class UtilityTests {

    @Autowired
    private MockMvc mockMvc;

    private static final String GET_INSTANT = "/api/v1/get-instant";

    @Test
    public void getInstantSuccess() throws Exception {
        MvcResult result = this.mockMvc.perform(get(String.format(GET_INSTANT))
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        Instant instant = UtilityTestMethods.toObjectInstant(jsonResponse, Instant.class);

        assertTrue(Instant.now().isAfter(instant)
            || Instant.now().minusSeconds((long) 1).isBefore(instant));
    }
}
