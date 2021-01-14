package com.rocketden.main.service;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.game_object.Game;

import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.game_object.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class SubmitService {

    private final SocketService socketService;

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
        Submission submission = new Submission();
        submission.setPlayerCode(playerCode);
        submission.setNumCorrect(10);
        submission.setNumTestCases(10);

        player.getSubmissions().add(submission);
        player.setSolved(true);

        // Sort list of players by who is winning
        sortLeaderboard(game.getPlayers());

        // Send socket update with latest leaderboard info
        socketService.sendSocketUpdate(GameMapper.toDto(game));
        // TODO: test socket in GameSocketTests when merged

        return GameMapper.submissionToDto(submission);
    }

    // Sort by numCorrect followed by startTime
    public void sortLeaderboard(List<Player> players) {
        Collections.sort(players, new Comparator<Player>() {
            int compare(Player player1, Player player2)  {
                List<Submission> submissions1 = player1.getSubmissions();
                List<Submission> submissions2 = player2.getSubmissions();

                // Players who haven't submitted yet are sorted last
                if (submissions1.isEmpty()) {
                    return 1;
                }
                if (submissions2.isEmpty()) {
                    return -1;
                }

                Submission sub1 = submissions1.get(submissions1.size() - 1);
                Submission sub2 = submissions2.get(submissions2.size() - 1);

                // If both have the same numCorrect, whoever submits earlier is first
                if (sub1.getNumCorrect().equals(sub2.getNumCorrect())) {
                    return sub1.getStartTime().compareTo(sub2.getStartTime());
                }

                // Whoever has higher numCorrect is first
                return sub2.getNumCorrect() - sub1.getNumCorrect();
            }
        });
    }
}
