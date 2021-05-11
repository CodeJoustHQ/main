package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
import com.codejoust.main.dto.account.AccountDto;
import com.codejoust.main.model.Account;
import com.codejoust.main.util.TestFields;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTests {

    @Mock
    private AccountRepository repository;

    @Mock
    private FirebaseService firebaseService;

    @Spy
    @InjectMocks
    private AccountService accountService;

    @Test
    public void getAccountSuccess() {
        Account account = TestFields.account1();

        Mockito.doReturn(account).when(repository).findAccountByUid(account.getUid());
        Mockito.doReturn(TestFields.UID).when(firebaseService).verifyToken(TestFields.TOKEN);

        AccountDto accountDto = accountService.getAccount(TestFields.UID, TestFields.TOKEN);

        assertEquals(account.getUid(), accountDto.getUid());
    }
}
