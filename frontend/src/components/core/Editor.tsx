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
  const [codeLanguage, setCodeLanguage] = useState('java');

  const handleEditorDidMount = (editor: any) => {
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });
  };

  return (
    <Content>
      <select
        onChange={(e) => setCodeLanguage(e.target.value)}
        value={codeLanguage}
      >
        {
          Object.keys(languages).map((language) => (
            <option value={language}>{languages[language].name}</option>
          ))
        }
      </select>
      <MonacoEditor
        height="100%"
        editorDidMount={handleEditorDidMount}
        language={codeLanguage}
        defaultValue={languages[codeLanguage].defaultCode}
      />
    </Content>
  );
}

export default ResizableMonacoEditor;
