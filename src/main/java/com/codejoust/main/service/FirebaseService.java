package com.codejoust.main.service;

import com.codejoust.main.exception.AccountError;
import com.codejoust.main.exception.api.ApiException;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class FirebaseService {

    // Takes a Firebase ID token and returns the UserID if valid or an error otherwise
    public String verifyToken(String token) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
            if (uid == null) {
                throw new ApiException(AccountError.INVALID_CREDENTIALS);
            }

            return uid;
        } catch (FirebaseAuthException e) {
            log.error("An error occurred contacting Firebase to verify an ID token:");
            log.error(e.getMessage());
        }

        return token;
    }
}
