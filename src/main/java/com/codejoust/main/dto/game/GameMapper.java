package com.codejoust.main.dto.game;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.codejoust.main.dto.problem.ProblemDto;
import com.codejoust.main.dto.problem.ProblemMapper;
import com.codejoust.main.dto.room.RoomMapper;
import com.codejoust.main.game_object.Game;
import com.codejoust.main.game_object.Player;
import com.codejoust.main.game_object.Submission;
import com.codejoust.main.model.Room;
import com.codejoust.main.model.User;
import com.codejoust.main.util.Color;
import com.codejoust.main.util.Utility;

public class GameMapper {

    private static final ModelMapper mapper = new ModelMapper();

    protected GameMapper() {}

    public static GameDto toDto(Game game) {
        if (game == null) {
            return null;
        }

        GameDto gameDto = new GameDto();
        gameDto.setRoom(RoomMapper.toDto(game.getRoom()));
        gameDto.setGameTimer(GameTimerMapper.toDto(game.getGameTimer()));
        gameDto.setPlayAgain(game.getPlayAgain());
        gameDto.setGameEnded(game.getGameEnded());

        // Set loose matching to allow flattening of variables in DTO objects
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);

        List<PlayerDto> players = gameDto.getPlayers();
        game.getPlayers().values().forEach(player -> players.add(mapper.map(player, PlayerDto.class)));
        sortLeaderboard(players);

        List<ProblemDto> problems = new ArrayList<>();
        game.getProblems().forEach(problem -> problems.add(ProblemMapper.toDto(problem)));
        gameDto.setProblems(problems);

        gameDto.setAllSolved(game.getAllSolved());

        return gameDto;
    }

    public static Game fromRoom(Room room) {
        if (room == null) {
            return null;
        }

        Game game = new Game();
        game.setRoom(room);

        // Create players and assign colors in random order.
        int index = 0;
        Map<String, Player> players = game.getPlayers();
        List<Color> colorList = new ArrayList<>(Utility.COLOR_LIST);
        Collections.shuffle(colorList);

        // Map all non-spectators to players.
        for (User user : room.getUsers()) {
            if (!user.getSpectator()) {
                Player player = PlayerMapper.playerFromUser(user);
                player.setColor(colorList.get(index));
                player.setSolved(new boolean[room.getNumProblems()]);
                players.put(user.getUserId(), player);
                index = (index + 1) % colorList.size();
            }
        }

        return game;
    }

    public static SubmissionDto submissionToDto(Submission submission) {
        if (submission == null) {
            return null;
        }

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);

        return mapper.map(submission, SubmissionDto.class);
    }

    // Sort by numCorrect followed by startTime
    public static void sortLeaderboard(List<PlayerDto> players) {
        players.sort((player1, player2) -> {
            List<SubmissionDto> submissions1 = player1.getSubmissions();
            List<SubmissionDto> submissions2 = player2.getSubmissions();

            // Players who haven't submitted yet are sorted last
            if (submissions1.isEmpty()) {
                return 1;
            } else if (submissions2.isEmpty()) {
                return -1;
            }

            SubmissionDto bestSub1 = submissions1.get(0);
            SubmissionDto bestSub2 = submissions2.get(0);

            // Get the best solution by each player (highest score, then earliest submission)
            for (SubmissionDto sub : submissions1) {
                if (sub.getNumCorrect() > bestSub1.getNumCorrect()) {
                    bestSub1 = sub;
                }
            }

            for (SubmissionDto sub : submissions2) {
                if (sub.getNumCorrect() > bestSub2.getNumCorrect()) {
                    bestSub2 = sub;
                }
            }

            // If both have the same numCorrect, whoever submits earlier is first
            if (bestSub1.getNumCorrect().equals(bestSub2.getNumCorrect())) {
                return bestSub1.getStartTime().compareTo(bestSub2.getStartTime());
            }

            // Whoever has higher numCorrect is first
            return bestSub2.getNumCorrect() - bestSub1.getNumCorrect();
        });
    }

    // Get total number of problems solved
    private int getScore(List<SubmissionDto> submissions) {
        Set<Integer> set = new HashSet<>();
        for (SubmissionDto submission : submissions) {
            if (submission.getNumCorrect().equals(submission.getNumTestCases())) {
                set.add(submission.getProblemIndex());
            }
        }

        return set.size();
    }

    // Get time of latest correct solution, or null if none exists
    private Instant getTime(List<SubmissionDto> submissions) {
        Set<Integer> set = new HashSet<>();
        Instant instant = null;

        for (SubmissionDto submission : submissions) {
            if (submission.getNumCorrect().equals(submission.getNumTestCases())
                    && !set.contains(submission.getProblemIndex())) {
                set.add(submission.getProblemIndex());
                instant = submission.getStartTime();
            }
        }

        return instant;
    }
}
