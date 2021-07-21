package com.codejoust.main.service.generators;

import java.util.List;

import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;
import com.codejoust.main.model.report.CodeLanguage;

import org.springframework.stereotype.Service;

@Service
public class CppDefaultCodeGeneratorService implements DefaultCodeGeneratorService {

    @Override
    public String getDefaultCode(List<ProblemInput> problemInputs, ProblemIOType outputType) {
        boolean needStringImport = false;
        boolean needVectorImport = false;

        if (outputType == ProblemIOType.ARRAY_STRING) {
            needStringImport = true;
            needVectorImport = true;
        } else if (outputType == ProblemIOType.STRING) {
            needStringImport = true;
        } else if (outputType.getClassType().isArray()) {
            needVectorImport = true;
        }

        // Initialize method line StringBuilder with the output type.
        StringBuilder methodLineBuilder = new StringBuilder();
        methodLineBuilder.append(String.format("\t\t%s solve(", typeInstantiationToString(outputType)));

        // Add all of the method inputs and names.
        String prefix = "";
        for (ProblemInput problemInput : problemInputs) {
            if (problemInput.getType() == ProblemIOType.ARRAY_STRING) {
                needStringImport = true;
                needVectorImport = true;
            } else if (problemInput.getType() == ProblemIOType.STRING) {
                needStringImport = true;
            } else if (problemInput.getType().getClassType().isArray()) {
                needVectorImport = true;
            }

            methodLineBuilder.append(prefix);
            prefix = ", ";
            methodLineBuilder.append(String.format("%s %s",
                typeInstantiationToString(problemInput.getType()),
                problemInput.getName()
            ));
        }
        methodLineBuilder.append(") {");

        StringBuilder importLineBuilder = new StringBuilder();
        if (needStringImport) {
            importLineBuilder.append("#include <string>\n");
        } else if (needVectorImport) {
            importLineBuilder.append("#include <vector>\n");
        }

        return String.join("\n", 
            importLineBuilder.toString(),
            "using namespace std;",
            "",
            "class Solution {",
            "\tpublic:",
            methodLineBuilder.toString(),
            "\t\t\t",
            "\t\t}",
            "}",
            ""
        );
    }

    @Override
    public String typeInstantiationToString(ProblemIOType ioType) {
        if (ioType == null) {
            throw new ApiException(ProblemError.BAD_IOTYPE);
        }

        switch (ioType) {
            case STRING:
                return "string";
            case INTEGER:
                return "int";
            case DOUBLE:
                return "double";
            case CHARACTER:
                return "char";
            case BOOLEAN:
                return "bool";
            case ARRAY_STRING:
                return "vector<string>";
            case ARRAY_INTEGER:
                return "vector<int>";
            case ARRAY_DOUBLE:
                return "vector<double>";
            case ARRAY_CHARACTER:
                return "vector<char>";
            case ARRAY_BOOLEAN:
                return "vector<bool>";
            default:
                throw new ApiException(ProblemError.BAD_IOTYPE);
        }
    }

    @Override
    public CodeLanguage getLanguage() {
        return CodeLanguage.CPP;
    }
}
