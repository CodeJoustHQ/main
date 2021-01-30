package com.rocketden.main.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import com.rocketden.main.model.problem.ProblemIOType;
import com.rocketden.main.model.problem.ProblemInput;
import com.rocketden.main.service.generators.JavaDefaultCodeGeneratorService;
import com.rocketden.main.service.generators.PythonDefaultCodeGeneratorService;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class DefaultCodeGeneratorServiceTests {

    @Spy
    @InjectMocks
    private JavaDefaultCodeGeneratorService javaDefaultCodeGeneratorService;

    @Spy
    @InjectMocks
    private PythonDefaultCodeGeneratorService pythonDefaultCodeGeneratorService;

    private static final String INPUT_NAME = "nums";
    private static final ProblemIOType IO_TYPE = ProblemIOType.ARRAY_INTEGER;

    private static final String javaDefaultCode =
        "import java.util.*;\n\npublic class Solution {\n\tpublic int[] solve(int[] nums) {\n\t\t\n\t}\n}\n";

    public static final String pythonDefaultCode =
        "class Solution(object):\n\tdef solve(nums):\n\t\t";

    /**
     * Helper method to test the "getDefaultCode" method across languages.
     * 
     * @param defaultCodeGeneratorService The language-specific service class.
     * @param defaultCode Get the language-specific default code.
     */
    public void getDefaultCodeSetupMethod(DefaultCodeGeneratorService defaultCodeGeneratorService, String defaultCode) {
        List<ProblemInput> problemInputs = new ArrayList<>();
        problemInputs.add(new ProblemInput(INPUT_NAME, IO_TYPE));
        String response = defaultCodeGeneratorService.getDefaultCode(problemInputs, IO_TYPE);
        assertEquals(defaultCode, response);
    }

    @Test
    public void getDefaultCodeJava() {
        List<ProblemInput> problemInputs = new ArrayList<>();
        problemInputs.add(new ProblemInput(INPUT_NAME, IO_TYPE));
        String response = javaDefaultCodeGeneratorService.getDefaultCode(problemInputs, IO_TYPE);
        assertEquals(javaDefaultCode, response);
    }

    @Test
    public void getDefaultCodePython() {
        getDefaultCodeSetupMethod(pythonDefaultCodeGeneratorService, pythonDefaultCode);
    }
}
