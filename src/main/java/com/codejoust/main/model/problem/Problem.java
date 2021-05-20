package com.codejoust.main.model.problem;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.ManyToMany;

import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity // This tells Hibernate to make a table out of this class
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // Auto-generate default business ID for each problem
    @EqualsAndHashCode.Include
    private String problemId = UUID.randomUUID().toString();
    private String name;
    private Boolean approval = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Generated from all the test cases with matching problem variable. If the problem
     * is deleted or test cases are removed from this list, the test cases will also be deleted.
     * Setter is set to private to ensure proper use of addTestCase and removeTestCase methods.
     */
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    private List<ProblemTestCase> testCases = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ProblemDifficulty difficulty;

    // Additional fields for the default code generation.
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<ProblemInput> problemInputs = new ArrayList<>();

    // List of tags associated with this problem
    @ManyToMany(mappedBy = "problems", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Setter(AccessLevel.PRIVATE)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<ProblemTag> problemTags = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ProblemIOType outputType;

    public void addTestCase(ProblemTestCase testCase) {
        testCases.add(testCase);
        testCase.setProblem(this);
    }

    public boolean removeTestCase(ProblemTestCase testCase) {
        return testCases.remove(testCase);
    }

    public void addProblemTag(ProblemTag problemTag) {
        problemTags.add(problemTag);
        problemTag.addProblem(this);
    }

    public boolean removeProblemTag(ProblemTag problemTag) {
        problemTag.removeProblem(this);
        return problemTags.remove(problemTag);
    }

    public void addProblemInput(ProblemInput problemInput) {
        problemInputs.add(problemInput);
        problemInput.setProblem(this);
    }
}
