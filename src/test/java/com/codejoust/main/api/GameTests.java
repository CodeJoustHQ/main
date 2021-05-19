package com.codejoust.main.api;

import com.codejoust.main.dto.game.GameDto;
import com.codejoust.main.dto.game.GameNotificationDto;
import com.codejoust.main.dto.game.GameNotificationRequest;
import com.codejoust.main.dto.game.PlayerDto;
import com.codejoust.main.dto.game.StartGameRequest;
import com.codejoust.main.dto.game.SubmissionDto;
import com.codejoust.main.dto.game.SubmissionRequest;
import com.codejoust.main.dto.game.SubmissionResultDto;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.SelectableProblemDto;
import com.codejoust.main.dto.room.CreateRoomRequest;
import com.codejoust.main.dto.room.RoomDto;
import com.codejoust.main.dto.room.UpdateSettingsRequest;
import com.codejoust.main.dto.user.UserDto;
import com.codejoust.main.dto.user.UserMapper;
import com.codejoust.main.exception.GameError;
import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.RoomError;
import com.codejoust.main.exception.api.ApiError;
import com.codejoust.main.exception.api.ApiErrorResponse;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.game_object.GameTimer;
import com.codejoust.main.game_object.NotificationType;
import com.codejoust.main.model.User;
import com.codejoust.main.service.SubmitService;
import com.codejoust.main.util.ProblemTestMethods;
import com.codejoust.main.util.RoomTestMethods;
import com.codejoust.main.util.UtilityTestMethods;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Collections;

@SpringBootTest(properties = "spring.datasource.type=com.zaxxer.hikari.HikariDataSource")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class GameTests {

    @Autowired
    private MockMvc mockMvc;

    // Predefine problem attributes.
    private static final String INPUT = "[1, 3, 2]";
    private static final String OUTPUT = SubmitService.DUMMY_OUTPUT;
    private static final Double RUNTIME = SubmitService.DUMMY_RUNTIME;

    private static final String POST_ROOM = "/api/v1/rooms";
    private static final String UPDATE_ROOM = "/api/v1/rooms/%s/settings";
    private static final String START_GAME = "/api/v1/rooms/%s/start";
    private static final String GET_GAME = "/api/v1/games/%s";
    private static final String POST_RUN_CODE = "/api/v1/games/%s/run-code";
    private static final String POST_SUBMISSION = "/api/v1/games/%s/submission";
    private static final String POST_NOTIFICATION = "/api/v1/games/%s/notification";

    // Predefine user and room attributes.
    private static final String NICKNAME = "rocket";
    private static final String NICKNAME_2 = "rocketrocket";
    private static final String ROOM_ID = "012345";
    private static final String USER_ID = "098765";
    private static final String CODE = "print('hello')";
    private static final CodeLanguage LANGUAGE = CodeLanguage.PYTHON;

    // Predefine notification content.
    private static final String CONTENT = "[1, 2, 3]";

    // Helper method to start the game for a given room
    private void startGameHelper(RoomDto room, UserDto host) throws Exception {
        ProblemTestMethods.createSingleApprovedProblemAndTestCases(this.mockMvc);

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
        request.setInitiator(roomDto.getHost());

        ProblemTestMethods.createSingleApprovedProblemAndTestCases(this.mockMvc);

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
        GameDto gameDto = UtilityTestMethods.toObjectInstant(jsonResponse, GameDto.class);

        assertEquals(actual, gameDto.getRoom());
        assertEquals(1, gameDto.getPlayers().size());
        assertEquals(GameTimer.DURATION_15, gameDto.getGameTimer().getDuration());
    }

    @Test
    public void startGameWithProblemIdGetsCorrectProblem() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        ProblemTestMethods.createSingleApprovedProblemAndTestCases(this.mockMvc);
        ProblemDto problemDto = ProblemTestMethods.createSingleApprovedProblemAndTestCases(this.mockMvc);

        UpdateSettingsRequest updateRequest = new UpdateSettingsRequest();
        updateRequest.setInitiator(host);
        updateRequest.setNumProblems(3);

        SelectableProblemDto selectableDto = new SelectableProblemDto();
        selectableDto.setProblemId(problemDto.getProblemId());
        selectableDto.setName(problemDto.getName());
        selectableDto.setDifficulty(problemDto.getDifficulty());

        updateRequest.setProblems(Collections.singletonList(selectableDto));

        MvcResult result = this.mockMvc.perform(put(String.format(UPDATE_ROOM, roomDto.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(updateRequest)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        RoomDto response = UtilityTestMethods.toObject(jsonResponse, RoomDto.class);

        assertEquals(1, response.getProblems().size());
        assertEquals(selectableDto.getProblemId(), response.getProblems().get(0).getProblemId());
        assertEquals(selectableDto.getName(), response.getProblems().get(0).getName());
        assertEquals(selectableDto.getDifficulty(), response.getProblems().get(0).getDifficulty());

        // Note: this also creates a problem (so total number of problems is 3)
        startGameHelper(roomDto, host);

        result = this.mockMvc.perform(get(String.format(GET_GAME, roomDto.getRoomId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        GameDto gameDto = UtilityTestMethods.toObjectInstant(jsonResponse, GameDto.class);

        assertEquals(3, gameDto.getRoom().getNumProblems());
        assertEquals(3, gameDto.getProblems().size());
        assertEquals(problemDto.getProblemId(), gameDto.getProblems().get(0).getProblemId());
        assertNotEquals(gameDto.getProblems().get(0).getProblemId(), gameDto.getProblems().get(1).getProblemId());
        assertNotEquals(gameDto.getProblems().get(1).getProblemId(), gameDto.getProblems().get(2).getProblemId());
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
    public void startGameProblemNotEnoughFound() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);

        StartGameRequest request = new StartGameRequest();
        request.setInitiator(host);

        ApiError ERROR = ProblemError.NOT_ENOUGH_FOUND;

        MvcResult result = this.mockMvc.perform(post(String.format(START_GAME, roomDto.getRoomId()))
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
    public void runCodeSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        startGameHelper(roomDto, host);

        SubmissionRequest request = new SubmissionRequest();
        request.setInitiator(host);
        request.setCode(CODE);
        request.setLanguage(LANGUAGE);
        request.setInput(INPUT);

        MvcResult result = this.mockMvc.perform(post(String.format(POST_RUN_CODE, roomDto.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        SubmissionDto submissionDto = UtilityTestMethods.toObjectInstant(jsonResponse, SubmissionDto.class);

        assertEquals(CODE, submissionDto.getCode());
        assertEquals(LANGUAGE, submissionDto.getLanguage());
        assertEquals(submissionDto.getNumCorrect(), submissionDto.getNumTestCases());
        assertNull(submissionDto.getCompilationError());
        assertEquals(RUNTIME, submissionDto.getRuntime());
        assertTrue(Instant.now().isAfter(submissionDto.getStartTime())
            || Instant.now().minusSeconds((long) 1).isBefore(submissionDto.getStartTime()));

        SubmissionResultDto resultDto = submissionDto.getResults().get(0);
        assertEquals(OUTPUT, resultDto.getUserOutput());
        assertNull(resultDto.getError());
        assertEquals(INPUT, resultDto.getInput());
        assertEquals(OUTPUT, resultDto.getCorrectOutput());
        assertFalse(resultDto.isHidden());
        assertTrue(resultDto.isCorrect());

        // Check that the submission is stored in the game object
        result = this.mockMvc.perform(get(String.format(GET_GAME, roomDto.getRoomId())))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        jsonResponse = result.getResponse().getContentAsString();
        GameDto gameDto = UtilityTestMethods.toObjectInstant(jsonResponse, GameDto.class);

        // Confirm that running the code does not create a submission.
        assertEquals(1, gameDto.getPlayers().size());
        PlayerDto player = gameDto.getPlayers().get(0);
        assertFalse(gameDto.getAllSolved());
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
        SubmissionDto submissionDto = UtilityTestMethods.toObjectInstant(jsonResponse, SubmissionDto.class);

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
        GameDto gameDto = UtilityTestMethods.toObjectInstant(jsonResponse, GameDto.class);

        assertEquals(1, gameDto.getPlayers().size());
        PlayerDto player = gameDto.getPlayers().get(0);
        submissionDto = player.getSubmissions().get(0);
        assertEquals(CODE, submissionDto.getCode());
        assertEquals(LANGUAGE, submissionDto.getLanguage());
        assertEquals(submissionDto.getNumCorrect(), submissionDto.getNumTestCases());
        assertNull(submissionDto.getCompilationError());
        assertEquals(RUNTIME, submissionDto.getRuntime());
        assertTrue(Instant.now().isAfter(submissionDto.getStartTime())
            || Instant.now().minusSeconds((long) 1).isBefore(submissionDto.getStartTime()));

        SubmissionResultDto resultDto = submissionDto.getResults().get(0);
        assertEquals(OUTPUT, resultDto.getUserOutput());
        assertNull(resultDto.getError());
        assertEquals(INPUT, resultDto.getInput());
        assertEquals(OUTPUT, resultDto.getCorrectOutput());
        assertFalse(resultDto.isHidden());
        assertTrue(resultDto.isCorrect());
        
        assertTrue(gameDto.getAllSolved());
    }

    @Test
    public void sendNotificationSuccess() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        startGameHelper(roomDto, host);

        GameNotificationRequest request = new GameNotificationRequest();
        request.setInitiator(host);
        request.setContent(CONTENT);
        request.setNotificationType(NotificationType.TEST_CORRECT);

        MvcResult result = this.mockMvc.perform(post(String.format(POST_NOTIFICATION, roomDto.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(UtilityTestMethods.convertObjectToJsonString(request)))
                .andDo(print()).andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        GameNotificationDto notificationDtoResult = UtilityTestMethods.toObjectInstant(jsonResponse, GameNotificationDto.class);

        assertNotNull(notificationDtoResult);
        assertEquals(request.getInitiator(), notificationDtoResult.getInitiator());
        assertEquals(request.getNotificationType(), notificationDtoResult.getNotificationType());
        assertEquals(request.getContent(), notificationDtoResult.getContent());
        assertTrue(Instant.now().isAfter(notificationDtoResult.getTime())
            || Instant.now().minusSeconds((long) 1).isBefore(notificationDtoResult.getTime()));
    }

    @Test
    public void submitSolutionBadLanguage() throws Exception {
        UserDto host = new UserDto();
        host.setNickname(NICKNAME);
        host.setUserId(USER_ID);

        RoomDto roomDto = RoomTestMethods.setUpRoomWithOneUser(this.mockMvc, host);
        startGameHelper(roomDto, host);

        String request = "{\"initiator\": {\"nickname\": \"hi\"}, \"code\": \"print('hi')\", \"language\": \"x\"}";

        ApiError ERROR = GameError.BAD_LANGUAGE;

        MvcResult result = this.mockMvc.perform(post(String.format(POST_SUBMISSION, roomDto.getRoomId()))
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(request))
                .andDo(print()).andExpect(status().is(ERROR.getStatus().value()))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        ApiErrorResponse actual = UtilityTestMethods.toObject(jsonResponse, ApiErrorResponse.class);

        assertEquals(ERROR.getResponse(), actual);
    }
}
