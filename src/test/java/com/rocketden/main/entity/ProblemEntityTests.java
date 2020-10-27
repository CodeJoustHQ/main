package com.rocketden.main.entity;

import com.rocketden.main.model.problem.Problem;
import com.rocketden.main.model.problem.ProblemTestCase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ProblemEntityTests {

    private static final int ID = 10;
    private static final String INPUT = "[1, 8, 2]";
    private static final String OUTPUT = "[1, 2, 8]";

    @Test
    public void problemInitialization() {
        Problem problem = new Problem();

        assertNotNull(problem.getTestCases());
        assertTrue(problem.getTestCases().isEmpty());
    }

    @Test
    public void addTestCase() {
        Problem problem = new Problem();
        ProblemTestCase testCase = new ProblemTestCase();

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

        problem.addTestCase(testCase);

        ProblemTestCase caseToRemove = new ProblemTestCase();
        caseToRemove.setInput(INPUT);
        caseToRemove.setOutput(OUTPUT);
        caseToRemove.setHidden(true);

        assertFalse(problem.removeTestCase(caseToRemove));

        caseToRemove.setHidden(false);
        assertTrue(problem.removeTestCase(caseToRemove));
        assertTrue(problem.getTestCases().isEmpty());
    }
}
