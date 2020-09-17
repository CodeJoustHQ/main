package com.rocketden.main.dto.room;

import com.rocketden.main.model.Room;
import org.modelmapper.ModelMapper;

public class RoomMapper {

    protected RoomMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static RoomDto toDto(Room entity) {
        return mapper.map(entity, RoomDto.class);
    }
}
