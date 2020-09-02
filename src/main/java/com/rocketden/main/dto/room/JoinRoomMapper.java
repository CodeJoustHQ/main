package com.rocketden.main.dto.room;

import com.rocketden.main.model.Room;
import org.modelmapper.ModelMapper;

public class JoinRoomMapper {

    private static final ModelMapper mapper = new ModelMapper();

    public static JoinRoomResponse entityToResponse(Room entity) {
        return mapper.map(entity, JoinRoomResponse.class);
    }
}
