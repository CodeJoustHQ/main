package com.codejoust.main.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class FirebaseService {

    // Takes a Firebase ID token and returns the UserID if valid or an error otherwise
    public String verifyToken(String token) {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        String uid = decodedToken.getUid();

        return token;
    }
}
