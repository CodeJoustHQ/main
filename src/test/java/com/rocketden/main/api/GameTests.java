package com.rocketden.main.api;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.model.User;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.model.problem.ProblemTestCase;
import com.rocketden.main.util.UtilityTestMethods;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class GameTests {

	@Autowired
	private MockMvc mockMvc;

	@Mock
    private RoomRepository repository;
    
    @Mock
    private ProblemRepository problemRepository;

    // Predefine problem attributes.
    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";
    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

	private static final String POST_ROOM = "/api/v1/rooms";
	private static final String GET_GAME = "/api/v1/games/%s";
    private static final String START_GAME = "/api/v1/rooms/%s/start";

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String ROOM_ID = "012345";


	@Test
	public void startAndGetGameSuccess() throws Exception {
		UserDto host = new UserDto();
		host.setNickname(NICKNAME);

		CreateRoomRequest createRequest = new CreateRoomRequest();
		createRequest.setHost(host);

		MvcResult result = this.mockMvc.perform(post(POST_ROOM)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
				.andDo(print()).andExpect(status().isCreated())
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		RoomDto roomDto = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

		StartGameRequest request = new StartGameRequest();
        request.setInitiator(host);
        
        List<Problem> problems = new ArrayList<>();
        Problem problem = new Problem();
        problem.setName(NAME);
        problem.setDescription(DESCRIPTION);
        problem.setDifficulty(ProblemDifficulty.HARD);
        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        testCase.setHidden(true);
        problem.addTestCase(testCase);
        problems.add(problem);

        // Ensure that a problem will be returned on repository call.
        Mockito.doReturn(problems).when(problemRepository).findAll();

		result = this.mockMvc.perform(post(String.format(START_GAME, roomDto.getRoomId()))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(UtilityTestMethods.convertObjectToJsonString(request)))
				.andDo(print()).andExpect(status().isOk())
				.andReturn();

		jsonResponse = result.getResponse().getContentAsString();
		RoomDto actual = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

		assertEquals(roomDto.getRoomId(), actual.getRoomId());
		assertTrue(actual.isActive());

		// Check that game object was created properly
		result = this.mockMvc.perform(get(String.format(GET_GAME, roomDto.getRoomId())))
				.andDo(print()).andExpect(status().isOk())
				.andReturn();

		jsonResponse = result.getResponse().getContentAsString();
		GameDto gameDto = UtilityTestMethods.toObject(jsonResponse, GameDto.class);

		assertEquals(actual, gameDto.getRoom());
		assertNull(gameDto.getPlayerMap());
	}

	@Test
	public void startGameRoomNotFound() throws Exception {
		UserDto user = new UserDto();
		user.setNickname(NICKNAME);

		StartGameRequest request = new StartGameRequest();
		request.setInitiator(user);

		ApiError ERROR = RoomError.NOT_FOUND;

		MvcResult result = this.mockMvc.perform(post(String.format(START_GAME, ROOM_ID))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(UtilityTestMethods.convertObjectToJsonString(request)))
				.andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

		assertEquals(ERROR.getResponse(), actual);
	}

	@Test
	public void startGameWrongInitiator() throws Exception {
		User host = new User();
		host.setNickname(NICKNAME);

		CreateRoomRequest createRequest = new CreateRoomRequest();
		createRequest.setHost(UserMapper.toDto(host));

		MvcResult result = this.mockMvc.perform(post(POST_ROOM)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(UtilityTestMethods.convertObjectToJsonString(createRequest)))
				.andDo(print()).andExpect(status().isCreated())
				.andReturn();

		String jsonResponse = result.getResponse().getContentAsString();
		RoomDto roomDto = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

		UserDto user = new UserDto();
		user.setNickname(NICKNAME_2);
		StartGameRequest request = new StartGameRequest();
		request.setInitiator(user);

		ApiError ERROR = RoomError.INVALID_PERMISSIONS;

		result = this.mockMvc.perform(post(String.format(START_GAME, roomDto.getRoomId()))
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(UtilityTestMethods.convertObjectToJsonString(request)))
				.andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
				.andReturn();

		jsonResponse = result.getResponse().getContentAsString();
		ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

		assertEquals(ERROR.getResponse(), actual);
	}
}
