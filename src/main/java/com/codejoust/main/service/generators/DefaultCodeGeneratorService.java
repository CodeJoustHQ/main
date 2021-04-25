package com.codejoust.main.service.generators;

import java.util.List;

import com.codejoust.main.game_object.CodeLanguage;
import com.codejoust.main.model.problem.ProblemIOType;
import com.codejoust.main.model.problem.ProblemInput;

import org.springframework.stereotype.Service;

@Service
public interface DefaultCodeGeneratorService {

    // Generator the default code from the problem inputs and output.
    String getDefaultCode(List<ProblemInput> problemInputs, ProblemIOType outputType);

    // The implementation of the type's instantiation.
    String typeInstantiationToString(ProblemIOType ioType);

    // The language associated with the implementing class.
    CodeLanguage getLanguage();
    
}
