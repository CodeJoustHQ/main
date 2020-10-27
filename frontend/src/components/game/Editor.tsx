import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';

type LanguageType = {
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

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor() {
  const [currentLanguage, setCurrentLanguage] = useState('java');
  const [codeEditor, setCodeEditor] = useState<any>(null);

  const handleEditorDidMount = (editor: any) => {
    setCodeEditor(editor);
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });
  };

  const handleLanguageChange = (language: string) => {
    // Save the code for this language
    languages[currentLanguage].defaultCode = codeEditor!.getValue();

    // Change the language and initial code for the editor
    codeEditor!.setValue(languages[language].defaultCode);
    setCurrentLanguage(language);
  };

  return (
    <Content>
      <select
        onChange={(e) => handleLanguageChange(e.target.value)}
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
        defaultValue={languages[currentLanguage].defaultCode}
      />
    </Content>
  );
}

export default ResizableMonacoEditor;