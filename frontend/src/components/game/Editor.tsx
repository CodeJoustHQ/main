import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import Language, { fromString, languageToEditorLanguage } from '../../api/Language';
import { DefaultCodeType } from '../../api/Problem';

type EditorProps = {
  onLanguageChange: (language: string) => void,
  codeMap: DefaultCodeType | null,
  onChange: (code: string) => void,
};

const Content = styled.div`
  height: 100%;
`;

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor(props: EditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Python);
  const [codeEditor, setCodeEditor] = useState<any>(null);

  const { onLanguageChange, codeMap, onChange } = props;

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
        onChange={(e) => handleLanguageChange(fromString(e.target.value))}
        value={fromString(currentLanguage)}
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
        language={languageToEditorLanguage(currentLanguage)}
        defaultValue="Loading..."
        onChange={onChange}
      />
    </Content>
  );
}

export default ResizableMonacoEditor;
