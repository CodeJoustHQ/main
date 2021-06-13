package com.codejoust.main.model.report;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.codejoust.main.game_object.GameTimer;
import com.codejoust.main.model.User;
import com.codejoust.main.model.problem.Problem;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Getter
@Setter
public class GameReport {

    // ID used for the database.
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    
    private List<Problem> problems = new ArrayList<>();

    private List<User> users = new ArrayList<>();

    private GameTimer gameTimer;

    private Boolean playAgain = false;

    // Boolean to hold whether all users have solved the problem.
    private Boolean allSolved = false;

    // Boolean to hold whether the host ended the game early
    private Boolean gameEnded = false;

    // Store an enum for how the game ended.
    // Potentially store a simpler version of the game timer.

}
