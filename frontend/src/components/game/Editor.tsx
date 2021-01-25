import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { Problem } from '../../api/Problem';
import { defaultCodeGeneration, languages } from './Languages';

export type LanguageType = {
  [key: string]: {
    name: string,
    defaultCode: string,
  }
};

export type EditorProps = {
  onLanguageChange: (input: string) => void,
  onCodeUpdate: (input: string) => void,
  problem: Problem,
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

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the Monaco editor
function ResizableMonacoEditor(props: EditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState('java');
  const [codeEditor, setCodeEditor] = useState<any>(null);

  const { onLanguageChange, onCodeUpdate, problem } = props;

  const handleEditorDidMount = (editor: any) => {
    setCodeEditor(editor);
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });
    // Callback to save written code
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      onCodeUpdate(code);
    });
  };

  const handleLanguageChange = (p: Problem, language: string) => {
    // Save the code for this language
    languages[currentLanguage].defaultCode = codeEditor!.getValue();

    // Change the language and initial code for the editor
    codeEditor!.setValue(languages[language].defaultCode);
    setCurrentLanguage(language);
    onLanguageChange(language);
  };

  return (
    <Content>
      <select
        onChange={(e) => handleLanguageChange(problem, e.target.value)}
        value={currentLanguage}
      >
        {
          Object.keys(languages).map((language) => (
            <option key={language} value={language}>{languages[language].name}</option>
          ))
        }
      </select>
      <MonacoEditor
        height="100%"
        editorDidMount={handleEditorDidMount}
        language={currentLanguage}
        defaultValue={defaultCodeGeneration(problem, currentLanguage)}
      />
    </Content>
  );
}

export default ResizableMonacoEditor;
