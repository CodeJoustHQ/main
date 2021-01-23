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
    defaultCode:
      'public class Solution {\n'
      + '    public static void main(String[] args) {\n'
      + '        \n'
      + '    }\n'
      + '}\n',
  },
  python: {
    name: 'Python',
    defaultCode:
      'def solution():\n'
      + '    \n',
  },
  javascript: {
    name: 'JavaScript',
    defaultCode:
      'function solution() {\n'
      + '    \n'
      + '}\n',
  },
  csharp: {
    name: 'C#',
    defaultCode:
      'using System;\n\n'
      + 'public class Solution\n{\n'
      + '    public static void Main()\n'
      + '    {\n'
      + '        \n'
      + '    }\n'
      + '}\n',
  },
};

export function languages2(problem: Problem) : string {
  switch (problem.codeLanguage) {
    case
  }
}

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
    for (let i = 0; i < problem.parameterTypes.length; i++) {
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
