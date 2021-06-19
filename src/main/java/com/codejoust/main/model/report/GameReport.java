package com.codejoust.main.model.report;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.codejoust.main.model.User;
import com.codejoust.main.model.problem.Problem;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Getter
@Setter
public class GameReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @EqualsAndHashCode.Include
    private String gameReportId = UUID.randomUUID().toString();

    // TODO: What if a problem is deleted? What if that happens during a game?
    @OneToMany(mappedBy = "gameReport", fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Problem> problems = new ArrayList<>();

    private Integer numProblems;
    
    private Integer numProblemTestCases;

    @OneToMany(mappedBy = "gameReport", fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<User> users = new ArrayList<>();

    // The start time of the game
    private Instant createdDateTime;

    // The game duration, in seconds.
    private Long duration;

    // How the game ended.
    private GameEndType gameEndType;

    public void addUser(User user) {
        users.add(user);
    }
}
