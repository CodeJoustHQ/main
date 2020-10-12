package com.rocketden.main.api;

import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.model.User;
import com.rocketden.main.testutil.TestUtility;
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

import static org.junit.Assert.assertEquals;
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
	public void startGameSuccess() throws Exception {
		UserDto host = new UserDto();
		host.setNickname("rocket");

		CreateRoomRequest createRequest = new CreateRoomRequest();
		createRequest.setHost(host);

		MvcResult result = this.mockMvc.perform(post(POST_ROOM)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(TestUtility.convertObjectToJsonString(createRequest)))
				.andDo(print()).andExpect(status().isCreated())
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		RoomDto roomDto = TestUtility.toObject(jsonResponse, RoomDto.class);

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(host);

		result = this.mockMvc.perform(post(String.format(START_GAME, roomDto.getRoomId()))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(TestUtility.convertObjectToJsonString(request)))
				.andDo(print()).andExpect(status().isOk())
				.andReturn();

		jsonResponse = result.getResponse().getContentAsString();
		RoomDto actual = TestUtility.toObject(jsonResponse, RoomDto.class);

		assertEquals(roomDto.getRoomId(), actual.getRoomId());
	}

	@Test
	public void startGameRoomNotFound() throws Exception {
		UserDto user = new UserDto();
		user.setNickname("rocket");
		String roomId = "123456";

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(user);

		ApiError ERROR = RoomError.NOT_FOUND;

		MvcResult result = this.mockMvc.perform(post(String.format(START_GAME, roomId))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(TestUtility.convertObjectToJsonString(request)))
				.andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		ApiErrorResponse actual = TestUtility.toObject(jsonResponse, ApiErrorResponse.class);

		assertEquals(ERROR.getResponse(), actual);
	}

	@Test
	public void startGameWrongInitiator() throws Exception {
		User host = new User();
		host.setNickname("rocket");

		CreateRoomRequest createRequest = new CreateRoomRequest();
		createRequest.setHost(UserMapper.toDto(host));

		MvcResult result = this.mockMvc.perform(post(POST_ROOM)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(TestUtility.convertObjectToJsonString(createRequest)))
				.andDo(print()).andExpect(status().isCreated())
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		RoomDto roomDto = TestUtility.toObject(jsonResponse, RoomDto.class);

		UserDto user = new UserDto();
		user.setNickname("rocketrocket");
		StartGameRequest request = new StartGameRequest();
		request.setInitiator(user);

		ApiError ERROR = RoomError.INVALID_PERMISSIONS;

		result = this.mockMvc.perform(post(String.format(START_GAME, roomDto.getRoomId()))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(TestUtility.convertObjectToJsonString(request)))
				.andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
				.andReturn();

		jsonResponse = result.getResponse().getContentAsString();
		ApiErrorResponse actual = TestUtility.toObject(jsonResponse, ApiErrorResponse.class);

		assertEquals(ERROR.getResponse(), actual);
	}
}
