package com.codejoust.main.api;

import com.codejoust.main.dto.account.AccountDto;
import com.codejoust.main.exception.AccountError;
import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;
import com.codejoust.main.util.MockHelper;
import com.codejoust.main.util.TestFields;
import com.codejoust.main.util.TestUrls;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class AccountTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getAccountSuccess() throws Exception {
        AccountDto accountDto = MockHelper.getRequest(this.mockMvc, TestUrls.getAccount(TestFields.UID), AccountDto.class, HttpStatus.OK);
        assertEquals(TestFields.UID, accountDto.getUid());
        assertTrue(accountDto.getProblems().isEmpty());
    }

    @Test
    public void getAccountPermissionDenied() throws Exception {
        ApiError ERROR = AccountError.INVALID_CREDENTIALS;
        ApiErrorResponse actual = MockHelper.getRequest(this.mockMvc, TestUrls.getAccount("other-uid"), ApiErrorResponse.class, ERROR.getStatus());
        assertEquals(ERROR.getResponse(), actual);
    }
}
