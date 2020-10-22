package com.rocketden.main.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity // This tells Hibernate to make a table out of this class
@Getter
@Setter
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private String description;

    /**
     * Generated from all the test cases with matching problem variable. If the problem
     * is deleted or test cases are removed from this list, the test cases will also be deleted.
     * Setter is set to private to ensure proper use of addTestCase and removeTestCase methods.
     */
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter(AccessLevel.PRIVATE)
    private List<ProblemTestCase> testCases = new ArrayList<>();

    public void addTestCase(ProblemTestCase testCase) {
        testCases.add(testCase);
        testCase.setProblem(this);
    }

    public boolean removeTestCase(ProblemTestCase testCase) {
        return testCases.remove(testCase);
    }
}
