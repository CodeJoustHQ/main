package com.rocketden.main.service.generators;

import java.util.List;

import com.rocketden.main.exception.ProblemError;
import com.rocketden.main.exception.api.ApiException;
import com.rocketden.main.model.Language;
import com.rocketden.main.model.problem.ProblemIOType;
import com.rocketden.main.model.problem.ProblemInput;
import com.rocketden.main.service.DefaultCodeGeneratorService;

import org.springframework.stereotype.Service;

import lombok.Getter;

@Service
@Getter
public class JavaDefaultCodeGeneratorService implements DefaultCodeGeneratorService {

    @Override
    public String getDefaultCode(List<ProblemInput> problemInputs, ProblemIOType outputType) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String typeInstantiationToString(ProblemIOType ioType) {
        if (ioType == null) {
            throw new ApiException(ProblemError.BAD_IOTYPE);
        }

        switch (ioType) {
            case STRING:
                return "String";
            case INTEGER:
                return "int";
            case DOUBLE:
                return "double";
            case CHARACTER:
                return "char";
            case BOOLEAN:
                return "boolean";
            case ARRAY_STRING:
                return "String[]";
            case ARRAY_INTEGER:
                return "int[]";
            case ARRAY_DOUBLE:
                return "double[]";
            case ARRAY_CHARACTER:
                return "char[]";
            case ARRAY_BOOLEAN:
                return "boolean[]";
            default:
                throw new ApiException(ProblemError.BAD_IOTYPE);
        }
    }

    @Override
    public Language getLanguage() {
        return Language.JAVA;
    }
}
