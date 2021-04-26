package com.codejoust.main.api;


import com.codejoust.main.util.MockHelper;
import com.codejoust.main.util.TestUrls;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class UtilityTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getInstantSuccess() throws Exception {
        Instant instant = MockHelper.getRequest(this.mockMvc, TestUrls.getInstant(), Instant.class, HttpStatus.OK);
        assertTrue(Instant.now().isAfter(instant)
            || Instant.now().minusSeconds((long) 1).isBefore(instant));
    }
}
