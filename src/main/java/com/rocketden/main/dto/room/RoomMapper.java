package com.rocketden.main.dto.room;

import com.rocketden.main.model.Room;
import org.modelmapper.ModelMapper;

public class RoomMapper {

    protected RoomMapper() {}

    private static final ModelMapper mapper = new ModelMapper();

    public static CreateRoomResponse entityToCreateResponse(Room entity) {
        return mapper.map(entity, CreateRoomResponse.class);
    }

    public static JoinRoomResponse entityToJoinResponse(Room entity) {
        return mapper.map(entity, JoinRoomResponse.class);
    }

    public static GetRoomResponse entityToGetResponse(Room entity) {
        return mapper.map(entity, GetRoomResponse.class);
    }
}
