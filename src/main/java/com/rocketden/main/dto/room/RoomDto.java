package com.rocketden.main.dto.room;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.problem.ProblemDifficulty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class RoomDto {
    private String roomId;
    private UserDto host;
    private List<UserDto> users;
    private List<UserDto> activeUsers;
    private List<UserDto> inactiveUsers;
    private boolean active;
    private ProblemDifficulty difficulty;
    private long duration;
    private int size;
    private int numProblems;
}
