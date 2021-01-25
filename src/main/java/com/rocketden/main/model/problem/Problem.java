package com.rocketden.main.model.problem;

import javax.persistence.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity // This tells Hibernate to make a table out of this class
@Getter
@Setter
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // Auto-generate default business ID for each problem
    private String problemId = UUID.randomUUID().toString();

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

    @Enumerated(EnumType.STRING)
    private ProblemDifficulty difficulty;

    // These fields used for default code generation
    private String methodName;
    @ElementCollection
    private List<ProblemIOType> parameterTypes;
    @ElementCollection
    private List<String> parameterNames;
    private ProblemIOType outputType;

    public void addTestCase(ProblemTestCase testCase) {
        testCases.add(testCase);
        testCase.setProblem(this);
    }

    public boolean removeTestCase(ProblemTestCase testCase) {
        return testCases.remove(testCase);
    }
}
