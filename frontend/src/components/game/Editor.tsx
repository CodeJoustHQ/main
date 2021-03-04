import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import Language, { fromString, languageToEditorLanguage } from '../../api/Language';
import { DefaultCodeType } from '../../api/Problem';

type EditorProps = {
  onLanguageChange: (language: Language) => void,
  onCodeChange: (code: string) => void,
  codeMap: DefaultCodeType | null,
  defaultLanguage: Language,
};

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor(props: EditorProps) {
  const {
    onLanguageChange, onCodeChange, codeMap, defaultLanguage,
  } = props;

  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage);
  const [codeEditor, setCodeEditor] = useState<any>(null);

  useEffect(() => {
    setCurrentLanguage(defaultLanguage);
  }, [defaultLanguage]);

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
    if (codeMap != null && codeEditor != null) {
      codeMap[currentLanguage] = codeEditor.getValue();
      codeEditor.setValue(codeMap[language]);
    }

    // Change the language and initial code for the editor
    setCurrentLanguage(language);
    onLanguageChange(language);
  };

  useEffect(() => {
    if (codeMap != null && codeEditor != null) {
      codeEditor.setValue(codeMap[currentLanguage]);
    }
  }, [currentLanguage, codeMap, codeEditor, setCodeEditor]);

  return (
    <Content>
      <select
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        value={currentLanguage}
      >
        {
          Object.keys(Language).map((language) => (
            <option key={language} value={fromString(language)}>{language}</option>
          ))
        }
      </select>
      <MonacoEditor
        height="100%"
        editorDidMount={handleEditorDidMount}
        onChange={() => onCodeChange(codeEditor.getValue())}
        language={languageToEditorLanguage(currentLanguage)}
        defaultValue="Loading..."
      />
    </Content>
  );
}

export default ResizableMonacoEditor;
