package com.rocketden.main.dto.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteUserRequest {
	private UserDto userToDelete;
}
