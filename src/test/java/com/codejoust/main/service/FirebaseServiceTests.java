package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
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
public class FirebaseServiceTests {

    @Mock
    private AccountRepository repository;

    @Spy
    @InjectMocks
    private FirebaseService firebaseService;

    @Test
    public void verifyTokenSuccess() throws Exception {
        Mockito.doReturn(TestFields.UID).when(firebaseService).decodeToken(TestFields.TOKEN);

        String uid = firebaseService.verifyToken(TestFields.TOKEN);

        Mockito.verify(repository).save(Mockito.any(Account.class));
        assertEquals(TestFields.UID, uid);
    }

    @Test
    public void verifyTokenMatchesUidSuccess() throws Exception {
        Mockito.doReturn(TestFields.account1()).when(repository).findAccountByUid(TestFields.UID);
        Mockito.doReturn(TestFields.UID).when(firebaseService).decodeToken(TestFields.TOKEN);

        firebaseService.verifyTokenMatchesUid(TestFields.TOKEN, TestFields.UID);

        Mockito.verify(repository, Mockito.never()).save(Mockito.any(Account.class));
    }
}
