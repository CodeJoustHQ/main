package com.codejoust.main.model.problem;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity // This tells Hibernate to make a table out of this class
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProblemContainer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    // The problem associated with this game report
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "problem_table_id")
    private Problem problem;

    // The number of users who solved this problem.
    private Integer userSolvedCount;

    // The number of test cases.
    private Integer testCaseCount;

    // The average (mean) number of test cases passed.
    private Double averageTestCasesPassed;

    // The average (mean) number of submission attempts.
    private Double averageAttemptCount;

}
