package com.codejoust.main.entity;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.codejoust.main.model.problem.Problem;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.problem.ProblemTestCase;

@SpringBootTest
public class ProblemEntityTests {

    private static final int ID = 10;
    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";
    private static final String EXPLANATION = "2 < 8, so those are swapped.";

    @Test
    public void problemInitialization() {
        Problem problem = new Problem();

        assertNotNull(problem.getProblemId());
        assertNotNull(problem.getTestCases());
        assertTrue(problem.getTestCases().isEmpty());
    }

    @Test
    public void addTestCase() {
        Problem problem = new Problem();
        ProblemTestCase testCase = new ProblemTestCase();

        // The function has no restrictions on necessary test case components.
        problem.addTestCase(testCase);

        assertEquals(1, problem.getTestCases().size());
        assertEquals(testCase, problem.getTestCases().get(0));
        assertEquals(problem, testCase.getProblem());
    }

    @Test
    public void removeTestCase() {
        Problem problem = new Problem();

        ProblemTestCase testCase = new ProblemTestCase();
        testCase.setId(ID);
        testCase.setInput(INPUT);
        testCase.setOutput(OUTPUT);
        testCase.setExplanation(EXPLANATION);

        problem.addTestCase(testCase);

        ProblemTestCase caseToRemove = new ProblemTestCase();
        caseToRemove.setInput(INPUT);
        caseToRemove.setOutput(OUTPUT);
        caseToRemove.setExplanation(EXPLANATION);
        caseToRemove.setHidden(true);

        assertFalse(problem.removeTestCase(caseToRemove));

        caseToRemove.setId(ID);
        caseToRemove.setHidden(false);

        // Function returns true to remove test case, then false once deleted.
        assertTrue(problem.removeTestCase(caseToRemove));
        assertFalse(problem.removeTestCase(caseToRemove));
        assertTrue(problem.getTestCases().isEmpty());
    }

    @Test
    public void addProblemInput() {
        Problem problem = new Problem();
        ProblemInput problemInput = new ProblemInput();

        // The function has no restrictions on necessary test case components.
        problem.addProblemInput(problemInput);

        assertEquals(1, problem.getProblemInputs().size());
        assertEquals(problemInput, problem.getProblemInputs().get(0));
        assertEquals(problem, problemInput.getProblem());
    }
}
