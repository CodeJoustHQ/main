package com.codejoust.main.dto.account;

import com.codejoust.main.model.Account;
import org.modelmapper.ModelMapper;

public class AccountMapper {

    protected AccountMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static AccountDto toDto(Account entity) {
        if (entity == null) {
            return null;
        }

        return mapper.map(entity, AccountDto.class);
    }
}
