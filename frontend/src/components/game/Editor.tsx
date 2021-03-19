import React, { useContext, useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled, { ThemeContext } from 'styled-components';
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
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
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

/**
 * Options used to style the Monaco code editor
 * https://microsoft.github.io/monaco-editor/api/enums/monaco.editor.editoroption.html
 */
const monacoEditorOptions: any = {
  automaticLayout: true,
  fixedOverflowWidgets: true,
  fontFamily: 'Monaco',
  hideCursorInOverviewRuler: true,
  minimap: { enabled: false },
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  padding: { top: 10, bottom: 10 },
  quickSuggestions: false,
  renderLineHighlight: 'all',
  renderIndentGuides: false,
  renderWhitespace: 'none',
  scrollbar: {
    verticalScrollbarSize: 5,
    horizontalScrollbarSize: 5,
    useShadows: false,
  },
  scrollBeyondLastLine: false,
};

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor(props: EditorProps) {
  const {
    onLanguageChange, onCodeChange, codeMap, defaultLanguage,
  } = props;

  const theme = useContext(ThemeContext);
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

  const handleEditorWillMount = (editor: any) => {
    editor.editor.defineTheme('default-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBorder': theme.colors.background,
        'editor.lineHighlightBackground': theme.colors.background,
      },
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
      <LanguageContainer>
        <LanguageSelect
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          value={currentLanguage}
        >
          {
            Object.keys(Language).map((language) => (
              <option key={language} value={fromString(language)}>{language}</option>
            ))
          }
        </LanguageSelect>
      </LanguageContainer>
      <EditorContainer>
        <MonacoEditor
          options={monacoEditorOptions}
          theme="default-theme"
          height="100%"
          editorDidMount={handleEditorDidMount}
          editorWillMount={handleEditorWillMount}
          onChange={() => onCodeChange(codeEditor.getValue())}
          language={languageToEditorLanguage(currentLanguage)}
          defaultValue="Loading..."
        />
      </EditorContainer>
    </Content>
  );
}

export default ResizableMonacoEditor;
