package com.codejoust.main.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTests {

    @Mock
    private FirebaseService firebaseService;

    @Spy
    @InjectMocks
    private AccountService accountService;

    @Test
    public void test() {

    }
}
