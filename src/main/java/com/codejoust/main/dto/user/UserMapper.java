package com.codejoust.main.dto.user;

import com.codejoust.main.dto.account.AccountUidDto;
import com.codejoust.main.model.User;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

public class UserMapper {

    private static final ModelMapper mapper = new ModelMapper();

    protected UserMapper() {}

    public static UserDto toDto(User entity) {
        if (entity == null) {
            return null;
        }
        UserDto userDto = mapper.map(entity, UserDto.class);
        AccountUidDto accountUidDto = new AccountUidDto();
        accountUidDto.setUid(entity.getAccount().getUid());
        userDto.setAccountUid(accountUidDto);
        return userDto;
    }

    public static User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }

        // Matches strict variable names: https://stackoverflow.com/questions/49831753/modelmapper-matches-multiple-source-property-hierarchies.
        mapper.getConfiguration()
            .setMatchingStrategy(MatchingStrategies.STRICT);
        
        return mapper.map(dto, User.class);
    }
}
