package com.rocketden.main.dto.room;

import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.model.ProbemDifficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSettingsRequest {
    private UserDto initiator;
    private ProbemDifficulty difficulty;
}
