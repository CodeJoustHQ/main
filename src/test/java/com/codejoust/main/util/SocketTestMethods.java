package com.codejoust.main.util;

import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.util.ArrayList;
import java.util.List;

import com.codejoust.main.dto.problem.CreateProblemRequest;
import com.codejoust.main.dto.problem.CreateTestCaseRequest;
import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemInputDto;
import com.codejoust.main.dto.problem.ProblemTestCaseDto;
import com.codejoust.main.model.problem.ProblemDifficulty;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.socket.WebSocketConnectionEvents;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.*;

public class SocketTestMethods {

    // Predefine problem attributes.
    private static final String NAME = "Sort a List";
    private static final String DESCRIPTION = "Sort the given list in O(n log n) time.";
    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    private static final String INPUT_NAME = "nums";
    private static final ProblemIOType IO_TYPE = ProblemIOType.ARRAY_INTEGER;

    public static StompSession connectToSocket(String endpoint, String userId, int port) throws Exception {
        WebSocketStompClient newStompClient = new WebSocketStompClient(new SockJsClient(
                List.of(new WebSocketTransport(new StandardWebSocketClient()))));
        newStompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompHeaders headers = new StompHeaders();
        headers.add(WebSocketConnectionEvents.USER_ID_KEY, userId);

        return newStompClient
            .connect(endpoint, new WebSocketHttpHeaders(), headers, new StompSessionHandlerAdapter() {
                    @Override
                    public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
                        // This method can be used as a useful breakpoint.
                        throw new RuntimeException("Failure in WebSocket handling", exception);
                    }
                }, port)
                .get(3, SECONDS);
    }

    /**
     * Helper method that sends a POST request using template to
     * create a new problem
     * @throws Exception if anything wrong occurs
     */
    public static ProblemDto createSingleProblemAndTestCases(TestRestTemplate template, int port) throws Exception {
        CreateProblemRequest createProblemRequest = new CreateProblemRequest();
        createProblemRequest.setName(NAME);
        createProblemRequest.setDescription(DESCRIPTION);
        createProblemRequest.setDifficulty(ProblemDifficulty.EASY);

        List<ProblemInputDto> problemInputs = new ArrayList<>();
        ProblemInputDto problemInput = new ProblemInputDto(INPUT_NAME, IO_TYPE);
        problemInputs.add(problemInput);
        createProblemRequest.setProblemInputs(problemInputs);
        createProblemRequest.setOutputType(IO_TYPE);

        HttpEntity<CreateProblemRequest> createProblemEntity = new HttpEntity<>(createProblemRequest);
        String createProblemEndpoint = String.format("http://localhost:%s/api/v1/problems", port);

        ProblemDto problemActual = template.exchange(createProblemEndpoint, HttpMethod.POST, createProblemEntity, ProblemDto.class).getBody();

        assertNotNull(problemActual);
        assertEquals(NAME, problemActual.getName());
        assertEquals(DESCRIPTION, problemActual.getDescription());
        assertEquals(createProblemRequest.getDifficulty(), problemActual.getDifficulty());
        assertEquals(problemInputs, problemActual.getProblemInputs());
        assertEquals(IO_TYPE, problemActual.getOutputType());
        CreateTestCaseRequest createTestCaseRequest = new CreateTestCaseRequest();
        createTestCaseRequest.setInput(INPUT);
        createTestCaseRequest.setOutput(OUTPUT);

        HttpEntity<CreateTestCaseRequest> createTestCaseEntity = new HttpEntity<>(createTestCaseRequest);
        String createTestCaseEndpoint = String.format("http://localhost:%s/api/v1/problems/%s/test-case", port, problemActual.getProblemId());

        ProblemTestCaseDto testCaseActual = template.exchange(createTestCaseEndpoint, HttpMethod.POST, createTestCaseEntity, ProblemTestCaseDto.class).getBody();
        problemActual.getTestCases().add(testCaseActual);

        assertNotNull(testCaseActual);
        assertEquals(INPUT, testCaseActual.getInput());
        assertEquals(OUTPUT, testCaseActual.getOutput());
        assertFalse(testCaseActual.isHidden());

        return problemActual;
    }

    /**
     * Sets the approval for a new problem to true. Necessary for a number of tests
     * @throws Exception if anything wrong occurs
     */
    public static void createSingleApprovedProblemAndTestCases(TestRestTemplate template, int port) throws Exception {
        ProblemDto problem = createSingleProblemAndTestCases(template, port);
        problem.setApproval(true);

        HttpEntity<ProblemDto> editProblemEntity = new HttpEntity<>(problem);
        String editProblemEndpoint = String.format("http://localhost:%s/api/v1/problems/%s", port, problem.getProblemId());

        ProblemDto problemActual = template.exchange(editProblemEndpoint, HttpMethod.PUT, editProblemEntity, ProblemDto.class).getBody();

        assertNotNull(problemActual);
        assertTrue(problemActual.getApproval());
    }
}
