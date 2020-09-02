package com.rocketden.main.dto.room;

import com.rocketden.main.model.Room;
import org.modelmapper.ModelMapper;

public class CreateRoomMapper {

    private static final ModelMapper mapper = new ModelMapper();

    public static Room requestToEntity(CreateRoomRequest request) {
        // May be used in the future to map game settings and user info
        return new Room();
    }

    public static CreateRoomResponse entityToResponse(Room entity) {
        return mapper.map(entity, CreateRoomResponse.class);
    }
}
