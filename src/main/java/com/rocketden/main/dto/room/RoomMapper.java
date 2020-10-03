package com.rocketden.main.dto.room;

import java.util.HashSet;
import java.util.Set;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.Room;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RoomMapper {

    private static final Logger logger = LoggerFactory.getLogger(RoomMapper.class);

    protected RoomMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static RoomDto toDto(Room entity) {
        if (entity == null) {
            return null;
        }
        RoomDto roomDto = mapper.map(entity, RoomDto.class);

        // Separate users into active and inactive ones.
        logger.info("1");
        Set<UserDto> activeUsers = new HashSet<>();
        logger.info("2");
        Set<UserDto> inactiveUsers = new HashSet<>();
        logger.info("3");
        for (UserDto userDto : roomDto.getUsers()) {
            logger.info(userDto.getNickname());
            if (userDto.getSessionId() != null) {
                activeUsers.add(userDto);
            } else {
                inactiveUsers.add(userDto);
            }
        }
        logger.info("5");
        roomDto.setActiveUsers(activeUsers);
        logger.info("6");
        roomDto.setInactiveUsers(inactiveUsers);
        logger.info("7");
        logger.info(roomDto.toString());

        return roomDto;
    }
}
