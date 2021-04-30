package com.codejoust.main.service.generators;

import java.util.List;

import com.codejoust.main.exception.ProblemError;
import com.codejoust.main.exception.api.ApiException;
import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;

import org.springframework.stereotype.Service;

@Service
public class PythonDefaultCodeGeneratorService implements DefaultCodeGeneratorService {

    @Override
    public String getDefaultCode(List<ProblemInput> problemInputs, ProblemIOType outputType) {

        // Initialize method line StringBuilder.
        StringBuilder methodLineBuilder = new StringBuilder();
        methodLineBuilder.append("\tdef solve(self");

        // Add all of the method input names and types.
        for (ProblemInput problemInput : problemInputs) {
            methodLineBuilder.append(
                String.format(", %s: %s", 
                    problemInput.getName(),
                    typeInstantiationToString(outputType)
                )
            );
        }
        methodLineBuilder.append("):");

        return String.join("\n",
            "class Solution:",
            methodLineBuilder.toString(),
            "\t\t"
        );
    }

    @Override
    public String typeInstantiationToString(ProblemIOType ioType) {
        if (ioType == null) {
            throw new ApiException(ProblemError.BAD_IOTYPE);
        }

        switch (ioType) {
            case STRING:
                return "str";
            case INTEGER:
                return "int";
            case DOUBLE:
                return "float";
            case CHARACTER:
                // Since there is no Python character type, we use a string.
                return "str";
            case BOOLEAN:
                return "bool";
            case ARRAY_STRING:
                return "List[str]";
            case ARRAY_INTEGER:
                return "List[int]";
            case ARRAY_DOUBLE:
                return "List[float]";
            case ARRAY_CHARACTER:
                return "List[str]";
            case ARRAY_BOOLEAN:
                return "List[bool]";
            default:
                throw new ApiException(ProblemError.BAD_IOTYPE);
        }
    }

    @Override
    public CodeLanguage getLanguage() {
        return CodeLanguage.PYTHON;
    }
}
