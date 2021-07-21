package com.codejoust.main.service.generators;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import com.codejoust.main.model.problem.ProblemInput;

import com.codejoust.main.util.TestFields;
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
        "class Solution:",
        "",
        "\tdef solve(self, nums: list[int]) -> list[int]:",
        "\t\t"
    );

    private static final String cppDefaultCode = String.join("\n",
        "#include <vector>",
        "",
        "using namespace std;",
        "",
        "class Solution {",
        "\tpublic:",
        "\t\tvector<int> solve(vector<int> nums) {",
        "\t\t\t",
        "\t\t}",
        "}",
        ""
    );

    /**
     * Helper method to test the "getDefaultCode" method across languages.
     * 
     * @param defaultCodeGeneratorService The language-specific service class.
     * @param defaultCode Get the language-specific default code.
     */
    public void getDefaultCodeSetupMethod(DefaultCodeGeneratorService defaultCodeGeneratorService, String defaultCode) {
        List<ProblemInput> problemInputs = new ArrayList<>();
        problemInputs.add(new ProblemInput(TestFields.INPUT_NAME, TestFields.IO_TYPE));
        String response = defaultCodeGeneratorService.getDefaultCode(problemInputs, TestFields.IO_TYPE);
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

    @Test
    public void getDefaultCodeCpp() {
        getDefaultCodeSetupMethod(cppDefaultCodeGeneratorService, cppDefaultCode);
    }
}
