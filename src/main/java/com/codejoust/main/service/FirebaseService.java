package com.codejoust.main.service;

import com.codejoust.main.dao.AccountRepository;
import com.codejoust.main.exception.AccountError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.Account;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class FirebaseService {

    private final AccountRepository repository;

    public static final String TEST_UID = "asdfghjkl";

    @Value("${firebase.debugMode}")
    private Boolean debugMode;

    @Autowired
    public FirebaseService(AccountRepository repository) {
        this.repository = repository;
    }

    // Takes a Firebase ID token and returns the UserID if valid or an error otherwise
    public String verifyToken(String token) {
        // For MockMvc testing, return a test UID since it won't connect to Firebase
        if (debugMode != null && debugMode) {
            createAccountIfNoneExists(TEST_UID);
            return TEST_UID;
        }

        String uid = null;
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            uid = decodedToken.getUid();
        } catch (FirebaseAuthException e) {
            log.error("An error occurred contacting Firebase to verify an ID token:");
            log.error(e.getMessage());
        }

        if (uid == null) {
            throw new ApiException(AccountError.INVALID_CREDENTIALS);
        }

        createAccountIfNoneExists(uid);
        return uid;
    }

    public void verifyTokenMatchesUid(String token, String uid) {
        String decodedUid = verifyToken(token);
        if (!decodedUid.equals(uid)) {
            throw new ApiException(AccountError.INVALID_CREDENTIALS);
        }
    }

    // Make sure an account exists in our database to match Firebase
    private void createAccountIfNoneExists(String uid) {
        Account account = repository.findAccountByUid(uid);
        if (account == null) {
            account = new Account();
            account.setUid(uid);

            repository.save(account);
        }
    }
}
