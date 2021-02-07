package com.rocketden.main.service.generators;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import com.rocketden.main.model.problem.ProblemIOType;
import com.rocketden.main.model.problem.ProblemInput;

import org.junit.jupiter.api.Test;
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

    private static final String javaDefaultCode = String.join("\n",
        "import java.util.*;",
        "",
        "public class Solution {",
        "\tpublic int[] solve(int[] nums) {",
        "\t\t",
        "\t}",
        "}",
        ""
    );

    public static final String pythonDefaultCode = String.join("\n",
        "class Solution(object):",
        "\tdef solve(nums):",
        "\t\t"
    );

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
        getDefaultCodeSetupMethod(javaDefaultCodeGeneratorService, javaDefaultCode);
    }

    @Test
    public void getDefaultCodePython() {
        getDefaultCodeSetupMethod(pythonDefaultCodeGeneratorService, pythonDefaultCode);
    }
}