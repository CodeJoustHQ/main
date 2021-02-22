package com.rocketden.main.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.game.SubmissionMapper;
import com.rocketden.main.dto.game.TesterRequest;
import com.rocketden.main.dto.game.TesterResponse;
import com.rocketden.main.dto.game.TesterResult;
import com.rocketden.main.dto.problem.ProblemDto;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.dto.problem.ProblemTestCaseDto;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.TesterError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.Game;

import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.game_object.SubmissionResult;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class SubmitService {

    private final Gson gson;

    // Pulls value from application.properties
    @Value("${tester.debugMode}")
    private Boolean debugMode;

    @Value("${tester.url}")
    private String testerUrl;

    private final HttpClient httpClient;

    protected SubmitService() {
        this.httpClient = HttpClientBuilder.create().build();
        this.gson = new Gson();
    }

    // Helper method to return a perfect score dummy submission
    private Submission getDummySubmission(TesterRequest request) {
        int numTestCases = request.getProblem().getTestCases().size();
        PlayerCode playerCode = new PlayerCode(request.getCode(), request.getLanguage());

        Submission submission = new Submission();
        submission.setPlayerCode(playerCode);
        submission.setNumCorrect(numTestCases);
        submission.setNumTestCases(numTestCases);
        submission.setRuntime(5.5);

        return submission;
    }

    // Test the submission and send a socket update.
    public SubmissionDto runCode(Game game, SubmissionRequest request) {
        String userId = request.getInitiator().getUserId();
        Player player = game.getPlayers().get(userId);

        PlayerCode playerCode = new PlayerCode();
        playerCode.setCode(request.getCode());
        playerCode.setLanguage(request.getLanguage());

        player.setPlayerCode(playerCode);

        // Make a call to the tester service
        TesterRequest testerRequest = new TesterRequest();
        testerRequest.setCode(request.getCode());
        testerRequest.setLanguage(request.getLanguage());

        // Set the problem with the single provided test case.
        ProblemDto problemDto = ProblemMapper.toDto(game.getProblems().get(0));
        
        /**
         * Provide a temporary output to circumvent output parsing error.
         *
         * TODO: Implement run code on tester repository, so output not checked.
         * The problem must have at least one test case to work.
         */
        String tempOutput = problemDto.getTestCases().get(0).getOutput();
        problemDto.getTestCases().clear();

        List<ProblemTestCaseDto> problemTestCaseDtos = new ArrayList<>();
        ProblemTestCaseDto problemTestCaseDto = new ProblemTestCaseDto();
        problemTestCaseDto.setInput(request.getInput());
        problemTestCaseDto.setOutput(tempOutput);
        problemTestCaseDto.setHidden(false);
        problemTestCaseDtos.add(problemTestCaseDto);
        problemDto.setTestCases(problemTestCaseDtos);
        testerRequest.setProblem(problemDto);

        // Return submission, and no further records necessary for running code.
        Submission submission = getSubmission(testerRequest);
        return GameMapper.submissionToDto(submission);
    }

    // Test the submission and send a socket update.
    public SubmissionDto submitSolution(Game game, SubmissionRequest request) {
        String userId = request.getInitiator().getUserId();
        Player player = game.getPlayers().get(userId);

        PlayerCode playerCode = new PlayerCode();
        playerCode.setCode(request.getCode());
        playerCode.setLanguage(request.getLanguage());

        player.setPlayerCode(playerCode);

        // Make a call to the tester service
        TesterRequest testerRequest = new TesterRequest();
        testerRequest.setCode(request.getCode());
        testerRequest.setLanguage(request.getLanguage());
        testerRequest.setProblem(ProblemMapper.toDto(game.getProblems().get(0)));

        Submission submission = getSubmission(testerRequest);
        player.getSubmissions().add(submission);

        if (submission.getNumCorrect().equals(submission.getNumTestCases())) {
            player.setSolved(true);
        }

        // Variable to indicate whether all players have solved the problem.
        boolean allSolved = true;
        for (Player p : game.getPlayers().values()) {
            if (p.getSolved() == null || !p.getSolved()) {
                allSolved = false;
                break;
            }
        }

        // If the users have all completed the problem, set all solved to true.
        if (allSolved) {
            game.setAllSolved(true);
        }

        return GameMapper.submissionToDto(submission);
    }

    // Get submission (either through tester or using a dummy response)
    protected Submission getSubmission(TesterRequest request) {
        // If in debug mode (tester is unavailable), return a dummy submission
        if (getDebugMode()) {
            return getDummySubmission(request);
        }

        try {
            TesterResponse testerResponse = callTesterService(request);
            ProblemDto problem = request.getProblem();

            Submission submission = new Submission();
            submission.setNumCorrect(testerResponse.getNumCorrect());
            submission.setNumTestCases(testerResponse.getNumTestCases());
            submission.setRuntime(testerResponse.getRuntime());
            submission.setCompilationError(testerResponse.getCompilationError());
            submission.setStartTime(LocalDateTime.now());
            submission.setPlayerCode(new PlayerCode(request.getCode(), request.getLanguage()));

            // Set the SubmissionResult objects, add to the list.
            int index = 0;
            List<ProblemTestCaseDto> testCaseDtos = problem.getTestCases();
            List<SubmissionResult> results = new ArrayList<>();
            for (TesterResult testerResult : testerResponse.getResults()) {
                // Match the test case details with each individual result.
                ProblemTestCaseDto testCaseDto = testCaseDtos.get(index);
                SubmissionResult submissionResult = SubmissionMapper.toSubmissionResult(testerResult, testCaseDto);
                results.add(submissionResult);
                index++;
            }
            submission.setResults(results);
            
            return submission;
        } catch (ApiException e) {
            // If custom ApiException is thrown, pass that as the response
            throw e;
        } catch (Exception e) {
            // Throw generic 500 error
            throw new ApiException(GameError.TESTER_ERROR);
        }
    }

    // Sends a POST request to the tester service to judge the user submission
    protected TesterResponse callTesterService(TesterRequest request) throws IOException {
        HttpPost post = new HttpPost(getTesterUrl());

        StringEntity stringEntity = new StringEntity(gson.toJson(request));
        post.setEntity(stringEntity);
        post.setHeader("Content-type", "application/json");

        HttpResponse response = httpClient.execute(post);
        String jsonResponse = EntityUtils.toString(response.getEntity());

        // Throw tester error if the tester returns an error response
        int status = response.getStatusLine().getStatusCode();
        if (status >= 400) {
            ApiErrorResponse error = new Gson().fromJson(jsonResponse, ApiErrorResponse.class);
            throw new ApiException(new TesterError(HttpStatus.valueOf(status), error));
        }

        return gson.fromJson(jsonResponse, TesterResponse.class);
    }

    // Is null in certain testing environments; if so, return a default value
    private String getTesterUrl() {
        if (testerUrl == null) {
            return "http://localhost:8080";
        }
        return testerUrl;
    }

    // Is null in certain testing environments; if so, return true by default
    private boolean getDebugMode() {
        return debugMode == null || debugMode;
    }

    // This method should only be called for testing purposes
    protected void setDebugModeForTesting(boolean debugMode) {
        this.debugMode = debugMode;
    }
}
