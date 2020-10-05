package com.rocketden.main.dto.room;

import java.util.HashSet;
import java.util.Set;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.Room;
import org.modelmapper.ModelMapper;

public class RoomMapper {

    protected RoomMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static RoomDto toDto(Room entity) {
        if (entity == null) {
            return null;
        }
        RoomDto roomDto = mapper.map(entity, RoomDto.class);

        // Separate users into active and inactive ones.
        Set<UserDto> activeUsers = new HashSet<>();
        Set<UserDto> inactiveUsers = new HashSet<>();
        for (UserDto userDto : roomDto.getUsers()) {
            if (userDto.getSessionId() != null) {
                activeUsers.add(userDto);
            } else {
                inactiveUsers.add(userDto);
            }
        }
        roomDto.setActiveUsers(activeUsers);
        roomDto.setInactiveUsers(inactiveUsers);

        return roomDto;
    }
}
