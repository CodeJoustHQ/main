package com.codejoust.main.dto.room;

import java.util.ArrayList;
import java.util.List;

import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.model.Room;

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
        List<UserDto> activeUsers = new ArrayList<>();
        List<UserDto> inactiveUsers = new ArrayList<>();
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
