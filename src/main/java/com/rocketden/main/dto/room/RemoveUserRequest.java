package com.rocketden.main.dto.room;

import com.rocketden.main.dto.user.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RemoveUserRequest {
	private UserDto initiator;
	private UserDto userToDelete;
}
