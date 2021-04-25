package com.codejoust.main.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteUserRequest {
	private UserDto userToDelete;
}
