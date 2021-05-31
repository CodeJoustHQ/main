package com.codejoust.main.mapper;

import com.codejoust.main.dto.account.AccountDto;
import com.codejoust.main.dto.account.AccountMapper;
import com.codejoust.main.model.Account;
import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class AccountMapperTests {

    @Test
    public void toDto() {
        Account account = new Account();
        account.setUid(TestFields.UID);
        account.set

        AccountDto accountDto = AccountMapper.toDto(account);
        assertEquals(account.getUid(), accountDto.getUid());
        assertTrue(accountDto.getProblems().isEmpty());
    }
}
