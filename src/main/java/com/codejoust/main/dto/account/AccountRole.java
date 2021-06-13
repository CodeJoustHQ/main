package com.codejoust.main.dto.account;

import com.codejoust.main.exception.AccountError;
import com.codejoust.main.exception.api.ApiException;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum AccountRole {
    TEACHER, ADMIN;

    @JsonCreator
    public static AccountRole fromString(String value) {
        try {
            return AccountRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(AccountError.BAD_ROLE);
        }
    }
}
