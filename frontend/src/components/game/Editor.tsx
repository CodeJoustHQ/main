import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import Language, { fromString, languageToEditorLanguage } from '../../api/Language';
import { DefaultCodeType } from '../../api/Problem';

type EditorProps = {
  onLanguageChange: (language: string) => void,
  onCodeChange: (code: string) => void,
  codeMap: DefaultCodeType | null,
};

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
`;

const EditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const LanguageContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  margin: 5px;
  padding: 7.5px;
  background: transparent;
  text-align: center;
`;

const LanguageSelect = styled.select`
  padding: 4px 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.purple};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  
  &:hover {
    cursor: pointer;
  }
  
  // Clear effects on Safari and Firefox
  -moz-appearance: none; 
  -webkit-appearance: none; 
  appearance: none;
  
  &:focus {
    border: 2px solid ${({ theme }) => theme.colors.purple};
    outline: none;
  }
`;

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor(props: EditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Python);
  const [codeEditor, setCodeEditor] = useState<any>(null);

  const { onLanguageChange, onCodeChange, codeMap } = props;

  const handleEditorDidMount = (editor: any) => {
    setCodeEditor(editor);
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });

    // editor.defineTheme('default-theme', {
    //   base: 'vs',
    //   inherit: true,
    //   rules: [],
    //   colors: {
    //     'editor.background': '#000000',
    //   },
    // });
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
      <LanguageContainer>
        <LanguageSelect
          onChange={(e) => handleLanguageChange(fromString(e.target.value))}
          value={fromString(currentLanguage)}
        >
          {
            Object.keys(Language).map((language) => (
              <option key={language} value={language}>{language}</option>
            ))
          }
        </LanguageSelect>
      </LanguageContainer>
      <EditorContainer>
        <MonacoEditor
          options={{
            fixedOverflowWidgets: true,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderIndentGuides: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            renderLineHighlight: 'line',
            quickSuggestions: false,
            // fontFamily: 'Titillium Web',
          }}
          height="100%"
          editorDidMount={handleEditorDidMount}
          onChange={() => onCodeChange(codeEditor.getValue())}
          language={languageToEditorLanguage(currentLanguage)}
          defaultValue="Loading..."
        />
      </EditorContainer>
    </Content>
  );
}

export default ResizableMonacoEditor;
