package com.rocketden.main.dto.user;

import com.rocketden.main.model.User;
import org.modelmapper.ModelMapper;

public class UserMapper {

    protected UserMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static UserDto toDto(User entity) {
        if (entity == null) {
            return null;
        }
        return mapper.map(entity, UserDto.class);
    }

    public static User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }
        return mapper.map(dto, User.class);
    }
}
