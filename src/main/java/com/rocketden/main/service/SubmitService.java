package com.rocketden.main.service;

import com.google.gson.Gson;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.dto.game.TesterRequest;
import com.rocketden.main.dto.game.TesterResponse;
import com.rocketden.main.dto.problem.ProblemMapper;
import com.rocketden.main.exception.GameError;
import com.rocketden.main.exception.TesterError;
import com.rocketden.main.exception.api.ApiError;
import com.rocketden.main.exception.api.ApiErrorResponse;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.game_object.Game;

import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemIOType;
import com.rocketden.main.model.problem.ProblemInput;
import com.rocketden.main.model.problem.ProblemTestCase;
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
        submission.setRuntime(4.5);

        return submission;
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

        Submission submission = callTesterService(testerRequest);
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

    // Sends a POST request to the tester service to judge the user submission
    protected Submission callTesterService(TesterRequest request) {
        // If in debug mode (tester is unavailable), return a dummy submission
        if (getDebugMode()) {
            return getDummySubmission(request);
        }

        try {
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

            TesterResponse testerResponse = gson.fromJson(jsonResponse, TesterResponse.class);

            Submission submission = new Submission();
            submission.setNumCorrect(testerResponse.getNumCorrect());
            submission.setNumTestCases(testerResponse.getNumTestCases());
            submission.setRuntime(testerResponse.getRuntime());
            submission.setPlayerCode(new PlayerCode(request.getCode(), request.getLanguage()));


            return submission;
        } catch (ApiException e) {
            // If custom ApiException is thrown, pass that as the response
            throw e;
        } catch (Exception e) {
            // Throw generic 500 error
            throw new ApiException(GameError.TESTER_ERROR);
        }
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

    // TODO: Manual testing purposes only - delete later
    public static void main(String[] args) {
        Problem problem = new Problem();
        ProblemInput input = new ProblemInput();
        input.setName("num");
        input.setType(ProblemIOType.INTEGER);
        problem.addProblemInput(input);
        problem.setOutputType(ProblemIOType.INTEGER);

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setInput("5");
        testCase.setOutput("10");
        problem.addTestCase(testCase);

        TesterRequest testerRequest = new TesterRequest();
        testerRequest.setCode("class Solution:\n\tdef solve(num):\n\t\t:return num * 2");
        testerRequest.setLanguage(CodeLanguage.PYTHON);
        testerRequest.setProblem(ProblemMapper.toDto(problem));

        try {
            HttpPost post = new HttpPost("https://rocketden-tester.herokuapp.com/api/v1/runner");

            StringEntity stringEntity = new StringEntity(new Gson().toJson(testerRequest));
            post.setEntity(stringEntity);
            post.setHeader("Content-type", "application/json");

            HttpResponse response = HttpClientBuilder.create().build().execute(post);
            String jsonResponse = EntityUtils.toString(response.getEntity());

            // Throw tester error if the tester returns an error response
            int status = response.getStatusLine().getStatusCode();
            if (status >= 400) {
                ApiErrorResponse error = new Gson().fromJson(jsonResponse, ApiErrorResponse.class);
                throw new ApiException(new TesterError(HttpStatus.valueOf(status), error));
            }

            TesterResponse testerResponse = new Gson().fromJson(jsonResponse, TesterResponse.class);

            Submission submission = new Submission();
            submission.setNumCorrect(testerResponse.getNumCorrect());
            submission.setNumTestCases(testerResponse.getNumTestCases());
            submission.setRuntime(testerResponse.getRuntime());

            System.out.println(submission);
        } catch (ApiException e) {
            // If custom ApiException is thrown, pass that as the response
            throw e;
        } catch (Exception e) {
            // Throw generic 500 error
            throw new ApiException(GameError.TESTER_ERROR);
        }
    }
}
