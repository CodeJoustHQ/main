package com.rocketden.main.service;

import com.rocketden.main.dto.game.GameMapper;
import com.rocketden.main.dto.game.SubmissionDto;
import com.rocketden.main.dto.game.SubmissionRequest;
import com.rocketden.main.game_object.Game;

import com.rocketden.main.game_object.Player;
import com.rocketden.main.game_object.PlayerCode;
import com.rocketden.main.game_object.Submission;
import com.rocketden.main.model.problem.Problem;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Class to handle code updates and miscellaneous requests.
 */
@Service
public class SubmitService {

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

        return GameMapper.submissionToDto(submission);
    }

    /**
     * If all players have solved the problem, update the game as such.
     * (Depending on the game setting, this may or may not end the game).
     */
    public void conditionalSolvedSocketMessage(Game game) {
        // Variable to indicate whether all players have solved the problem.
        boolean allSolved = true;
        for (Player player : game.getPlayers().values()) {
            if (player.getSolved() == null || !player.getSolved()) {
                allSolved = false;
                break;
            }
        }

        // If the users have all completed the problem, end the game.
        if (allSolved) {
            game.setAllSolved(true);
        }
    }
}
