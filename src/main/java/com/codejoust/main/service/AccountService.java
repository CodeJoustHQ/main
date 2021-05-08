package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
import com.codejoust.main.dto.account.AccountDto;
import com.codejoust.main.dto.account.AccountMapper;
import com.codejoust.main.exception.AccountError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    private final FirebaseService service;
    private final AccountRepository repository;

    @Autowired
    public AccountService(FirebaseService service, AccountRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    public AccountDto getAccount(String uid, String token) {
        String verifiedUid = service.verifyToken(token);

        // Ensure that the user sent a valid token verifying their identity
        if (!verifiedUid.equals(uid)) {
            throw new ApiException(AccountError.INVALID_CREDENTIALS);
        }

        Account account = repository.findAccountByUid(uid);
        return AccountMapper.toDto(account);
    }
}
