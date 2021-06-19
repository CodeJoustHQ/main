package com.codejoust.main.model.report;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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

    private String gameReportId;

    @OneToMany(fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    @Fetch(value = FetchMode.SUBSELECT)
    @JoinColumn(name = "problems_table_id")
    private List<Problem> problems = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    @Fetch(value = FetchMode.SUBSELECT)
    @JoinColumn(name = "users_table_id")
    private List<User> users = new ArrayList<>();

    // The start time of the game
    private Instant createdDateTime;

    // The game duration, in seconds.
    private Long duration;

    // How the game ended.
    private GameEndType gameEndType;
}
