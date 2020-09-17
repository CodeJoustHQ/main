package com.rocketden.main.dto.user;

import com.rocketden.main.model.User;
import org.modelmapper.ModelMapper;

public class UserMapper {

    protected UserMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static UserDto toDto(User entity) {
        return mapper.map(entity, UserDto.class);
    }
}
