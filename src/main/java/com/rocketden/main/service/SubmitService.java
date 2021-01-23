package com.rocketden.main.service;

import com.google.gson.Gson;
import com.rocketden.main.dto.game.GameDto;
import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.game_object.Game;

import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.problem.Problem;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class SubmitService {

    private final SocketService socketService;

    private final Gson gson = new Gson();

    @Autowired
    protected SubmitService(SocketService socketService) {
        this.socketService = socketService;
    }

    // Test the submission and send a socket update.
    public SubmissionDto submitSolution(Game game, SubmissionRequest request) {
        String userId = request.getInitiator().getUserId();
        Player player = game.getPlayers().get(userId);

        PlayerCode playerCode = new PlayerCode();
        playerCode.setCode(request.getCode());
        playerCode.setLanguage(request.getLanguage());

        player.setPlayerCode(playerCode);

        // Create a dummy submission - this will be replaced with a call to the tester
        List<Problem> problems = game.getProblems();
        int numTestCases = problems.isEmpty() ? 0 : problems.get(0).getTestCases().size();

        Submission submission = new Submission();
        submission.setPlayerCode(playerCode);
        submission.setNumCorrect(numTestCases);
        submission.setNumTestCases(numTestCases);

        player.getSubmissions().add(submission);
        player.setSolved(true);

        // Sort list of players by who is winning
        GameDto gameDto = GameMapper.toDto(game);

        // Send socket update with latest leaderboard info
        socketService.sendSocketUpdate(gameDto);

        return GameMapper.submissionToDto(submission);
    }

    // Sends a POST request to the tester service to judge the user submission
    private Submission callTesterService(TesterRequest request) throws Exception {
        String postUrl = "https://site.com";
        HttpClient httpClient = HttpClientBuilder.create().build();
        HttpPost post = new HttpPost(postUrl);

        StringEntity stringEntity = new StringEntity(gson.toJson(request));
        post.setEntity(stringEntity);
        post.setHeader("Content-type", "application/json");

        HttpResponse response = httpClient.execute(post);
        String jsonResponse = EntityUtils.toString(response.getEntity());

        return gson.fromJson(jsonResponse, Submission.class);
    }
}
