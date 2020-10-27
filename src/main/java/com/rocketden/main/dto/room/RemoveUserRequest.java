package com.rocketden.main.dto.room;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RemoveUserRequest {
	private String initiatorId;
	private String userId;
}
