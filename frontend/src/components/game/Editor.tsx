import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { ProblemIO } from '../../api/Problem';
import { languages } from './Languages';

export type EditorProps = {
  onLanguageChange: (input: string) => void,
  onCodeUpdate: (input: string) => void,
  problem: (input: ProblemIO) => void,
};

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the Monaco editor
function ResizableMonacoEditor(props: EditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState('java');
  const [codeEditor, setCodeEditor] = useState<any>(null);

  const { onLanguageChange, onCodeUpdate } = props;

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

  const handleLanguageChange = (language: string) => {
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
