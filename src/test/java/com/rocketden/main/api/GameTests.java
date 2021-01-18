package com.rocketden.main.api;

import com.rocketden.main.dao.ProblemRepository;
import com.rocketden.main.dao.RoomRepository;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameNotificationDto;
import com.rocketden.main.dto.game.PlayerDto;
import com.rocketden.main.dto.game.StartGameRequest;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.problem.CreateProblemRequest;
import com.rocketden.main.dto.problem.CreateTestCaseRequest;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.dto.room.CreateRoomRequest;
import com.rocketden.main.dto.user.UserDto;
import com.rocketden.main.dto.room.RoomDto;
import com.rocketden.main.dto.user.UserMapper;
import com.rocketden.main.exception.RoomError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.game_object.GameTimer;
import com.rocketden.main.game_object.NotificationType;
import com.rocketden.main.model.User;
import com.rocketden.main.util.RoomTestMethods;
import com.rocketden.main.model.problem.ProblemDifficulty;
import com.rocketden.main.service.SocketService;
import com.rocketden.main.util.UtilityTestMethods;

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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
    
    @Mock
    private ProblemRepository problemRepository;

    @Mock
    private SocketService socketService;

    // Predefine problem attributes.
    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";
    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    private static final String POST_ROOM = "/api/v1/rooms";
    private static final String START_GAME = "/api/v1/rooms/%s/start";
    private static final String GET_GAME = "/api/v1/games/%s";
    private static final String POST_SUBMISSION = "/api/v1/games/%s/submission";
    private static final String POST_NOTIFICATION = "/api/v1/games/%s/notification";
    private static final String POST_PROBLEM_CREATE = "/api/v1/problems";
    private static final String POST_TEST_CASE_CREATE = "/api/v1/problems/%s/test-case";

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String CODE = "print('hello')";
    private static final String LANGUAGE = "python";

    // Predefine notification content.
    private static final String CONTENT = "[1, 2, 3]";

    // Helper method to start the game for a given room
    private void startGameHelper(RoomDto room, UserDto host) throws Exception {
        createSingleProblemAndTestCases();

        StartGameRequest request = new StartGameRequest();
        request.setInitiator(host);

        MvcResult result = this.mockMvc.perform(post(String.format(START_GAME, room.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto roomDto = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(room.getRoomId(), roomDto.getRoomId());
        assertTrue(roomDto.isActive());
    }

    /**
     * Helper method that sends a POST request to create a new problem
     * @return the created problem
     * @throws Exception if anything wrong occurs
     */
    private ProblemDto createSingleProblemAndTestCases() throws Exception {
        CreateProblemRequest createProblemRequest = new CreateProblemRequest();
        createProblemRequest.setName(NAME);
        createProblemRequest.setDescription(DESCRIPTION);
        createProblemRequest.setDifficulty(ProblemDifficulty.EASY);

        MvcResult problemResult = this.mockMvc.perform(post(POST_PROBLEM_CREATE)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createProblemRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String problemJsonResponse = problemResult.getResponse().getContentAsString();
        ProblemDto problemActual = UtilityTestMethods.toObject(problemJsonResponse, ProblemDto.class);

        assertEquals(NAME, problemActual.getName());
        assertEquals(DESCRIPTION, problemActual.getDescription());
        assertEquals(createProblemRequest.getDifficulty(), problemActual.getDifficulty());

        CreateTestCaseRequest createTestCaseRequest = new CreateTestCaseRequest();
        createTestCaseRequest.setInput(INPUT);
        createTestCaseRequest.setOutput(OUTPUT);

        String endpoint = String.format(POST_TEST_CASE_CREATE, problemActual.getProblemId());
        MvcResult testCaseResult = this.mockMvc.perform(post(endpoint)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(createTestCaseRequest)))
                .andDo(print()).andExpect(status().isCreated())
                .andReturn();

        String testCaseJsonResponse = testCaseResult.getResponse().getContentAsString();
        ProblemTestCaseDto testCaseActual = UtilityTestMethods.toObject(testCaseJsonResponse, ProblemTestCaseDto.class);

        assertEquals(INPUT, testCaseActual.getInput());
        assertEquals(OUTPUT, testCaseActual.getOutput());
        assertFalse(testCaseActual.isHidden());

        return problemActual;
    }

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

        createSingleProblemAndTestCases();

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
		GameDto gameDto = UtilityTestMethods.toObjectLocalDateTime(jsonResponse, GameDto.class);

        assertEquals(actual, gameDto.getRoom());
        assertEquals(1, gameDto.getPlayers().size());
		assertEquals(GameTimer.DURATION_15, gameDto.getGameTimer().getDuration());
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

    @Test
    public void submitSolutionSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        startGameHelper(roomDto, host);

        SubmissionRequest request = new SubmissionRequest();
        request.setInitiator(host);
        request.setCode(CODE);
        request.setLanguage(LANGUAGE);

        MvcResult result = this.mockMvc.perform(post(String.format(POST_SUBMISSION, roomDto.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        SubmissionDto submissionDto = UtilityTestMethods.toObject(jsonResponse, SubmissionDto.class);

        assertNotNull(submissionDto);
        assertEquals(CODE, submissionDto.getCode());
        assertEquals(LANGUAGE, submissionDto.getLanguage());
        // For now, just assert that all test cases were passed
        assertEquals(submissionDto.getNumCorrect(), submissionDto.getNumTestCases());

        // Check that the submission is stored in the game object
        result = this.mockMvc.perform(get(String.format(GET_GAME, roomDto.getRoomId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        GameDto gameDto = UtilityTestMethods.toObjectLocalDateTime(jsonResponse, GameDto.class);

        assertEquals(1, gameDto.getPlayers().size());
        PlayerDto player = gameDto.getPlayers().get(0);
        assertEquals(submissionDto, player.getSubmissions().get(0));
        assertEquals(submissionDto.getCode(), player.getCode());
        assertEquals(submissionDto.getLanguage(), player.getLanguage());
        assertTrue(player.getSolved());
    }

    @Test
    public void sendNotificationSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        startGameHelper(roomDto, host);

        // TODO: If time is replaced with LocalDateTime.now(), 400 error.

        GameNotificationDto notificationDto = new GameNotificationDto();
        notificationDto.setInitiator(host);
        notificationDto.setTime(null);
        notificationDto.setContent(CONTENT);
        notificationDto.setNotificationType(NotificationType.TEST_CORRECT);

        MvcResult result = this.mockMvc.perform(post(String.format(POST_NOTIFICATION, roomDto.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(notificationDto)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        GameNotificationDto notificationDtoResult = UtilityTestMethods.toObject(jsonResponse, GameNotificationDto.class);

        assertNotNull(notificationDtoResult);
        assertEquals(notificationDto, notificationDtoResult);
    }
}
