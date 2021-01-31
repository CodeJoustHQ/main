import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import Language, { fromString } from '../../api/Language';

type LanguageType = {
  [key: string]: {
    name: string,
    defaultCode: string,
  }
};

type EditorProps = {
  onLanguageChange: (language: string) => void,
  codeMap: Map<Language, string> | null,
};

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor(props: EditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Java);
  const [codeEditor, setCodeEditor] = useState<any>(null);

  const { onLanguageChange, codeMap } = props;

  const handleEditorDidMount = (editor: any) => {
    setCodeEditor(editor);
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });
  };

  const handleLanguageChange = (language: Language) => {
    // Save the code for this language
    // eslint-disable-next-line no-unused-expressions
    codeMap?.set(currentLanguage, codeEditor.getValue());

    // Change the language and initial code for the editor
    codeEditor.setValue(codeMap?.get(language));
    setCurrentLanguage(language);

    onLanguageChange(language);
  };

  return (
    <Content>
      <select
        onChange={(e) => handleLanguageChange(fromString(e.target.value))}
        value={currentLanguage}
      >
        {
          Object.keys(Language).map((language) => (
            <option key={language} value={language}>{language}</option>
          ))
        }
      </select>
      <MonacoEditor
        height="100%"
        editorDidMount={handleEditorDidMount}
        language={currentLanguage}
        defaultValue={codeMap ? codeMap.get(currentLanguage) : 'Loading...'}
      />
    </Content>
  );
}

export default ResizableMonacoEditor;
