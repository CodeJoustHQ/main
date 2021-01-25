import { Problem, ProblemIO } from '../../api/Problem';

export type LanguageType = {
  [key: string]: {
    name: string,
    defaultCode: string,
  }
};

export const languages: LanguageType = {
  java: {
    name: 'Java',
    defaultCode: '',
  },
  python: {
    name: 'Python',
    defaultCode: '',
  },
  javascript: {
    name: 'JavaScript',
    defaultCode: '',
  },
  csharp: {
    name: 'C#',
    defaultCode: '',
  },
};

export function javaCsharpFormatter(problem: Problem) : string {
  let defaultCode = 'public ';
  function types(type: ProblemIO): void {
    type === ProblemIO.STRING ? defaultCode += 'String '
      : type === ProblemIO.STRING_LIST ? defaultCode += 'String[] '
        : type === ProblemIO.INTEGER ? defaultCode += 'int '
          : type === ProblemIO.INTEGER_LIST ? defaultCode += 'int[] '
            : type === ProblemIO.BOOLEAN ? defaultCode += 'boolean '
              : type === ProblemIO.BOOLEAN_LIST ? defaultCode += 'boolean[] '
                : type === ProblemIO.VOID ? defaultCode += 'void '
                  : null;
  }
  types(problem.outputType);
  defaultCode += `${problem.methodName}(`;
  if (problem.parameterNames.length === problem.parameterTypes.length) {
    for (let i = 0; i < problem.parameterTypes.length; i += 1) {
      types(problem.parameterTypes[i]);
      defaultCode += `${problem.parameterNames[i]}`;
      if (i !== problem.parameterTypes.length - 1) {
        defaultCode += ', ';
      } else {
        defaultCode += ') {\\n'
        + '   \n'
        + '}\n';
      }
    }
  }
  return defaultCode;
}

export function pythonFormatter(problem: Problem) : string {
  return `def ${problem.methodName}():\n`;
}

export function javascriptFormatter(problem: Problem) : string {
  return `function ${problem.methodName}() {\n`
  + '\n'
  + '}\n';
}

export function defaultCodeGeneration(problem: Problem, language: string) : string {
  let defaultCode = '';
  switch (language) {
    case 'java' || 'csharp': {
      defaultCode = javaCsharpFormatter(problem);
      break;
    }
    case 'python': {
      defaultCode = pythonFormatter(problem);
      break;
    }
    case 'javascript': {
      defaultCode = javascriptFormatter(problem);
      break;
    }
    default: {
      break;
    }
  }
  return defaultCode;
}
