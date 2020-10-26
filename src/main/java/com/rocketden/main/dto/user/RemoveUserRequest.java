package com.rocketden.main.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RemoveUserRequest {
	private String initiatorId;
	private String userId;
}
