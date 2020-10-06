package com.rocketden.main.api;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.model.User;
import com.rocketden.main.util.Utility;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class GameTests {

	@Autowired
	private MockMvc mockMvc;

	@Mock
	private RoomRepository repository;

	private static final String POST_ROOM = "/api/v1/rooms";
	private static final String START_GAME = "/api/v1/rooms/%s/start";

	@Test
	public void startGameWrongHost() throws Exception {
		User host = new User();
		host.setNickname("rocket");

		CreateRoomRequest createRequest = new CreateRoomRequest();
		createRequest.setHost(UserMapper.toDto(host));

		MvcResult result = this.mockMvc.perform(post(POST_ROOM)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(Utility.convertObjectToJsonString(createRequest)))
				.andDo(print()).andExpect(status().isCreated())
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		RoomDto roomDto = Utility.toObject(jsonResponse, RoomDto.class);

		UserDto user = new UserDto();
		user.setNickname("rocketrocket");
		StartGameRequest request = new StartGameRequest();
		request.setRoomId(roomDto.getRoomId());
		request.setUser(user);

		this.mockMvc.perform(post(String.format(START_GAME, roomDto.getRoomId()))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(Utility.convertObjectToJsonString(request)))
				.andExpect(status().isForbidden());
	}
}
