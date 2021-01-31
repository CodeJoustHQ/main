package com.rocketden.main.service;

import java.util.List;

import com.rocketden.main.game_object.CodeLanguage;
import com.rocketden.main.model.problem.ProblemIOType;
import com.rocketden.main.model.problem.ProblemInput;

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
