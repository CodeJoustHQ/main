import React, { useContext, useEffect, useState } from 'react';
import MonacoEditor, { EditorConstructionOptions } from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styled, { ThemeContext } from 'styled-components';
import Language, { fromString, languageToEditorLanguage } from '../../api/Language';
import { DefaultCodeType } from '../../api/Problem';

type EditorProps = {
  onLanguageChange: ((language: Language) => void) | null,
  onCodeChange: ((code: string) => void) | null,
  getCurrentLanguage: (() => Language) | null,
  defaultCodeMap: DefaultCodeType[] | null,
  defaultLanguage: Language,
  defaultCode: string | null,
  currentProblem: number
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
  text-align-last: center;
  
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
const monacoEditorOptions: EditorConstructionOptions = {
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
    onLanguageChange, onCodeChange, getCurrentLanguage, defaultCodeMap, defaultLanguage, defaultCode, currentProblem,
  } = props;

  const theme = useContext(ThemeContext);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage);
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [codeMap, setCodeMap] = useState<DefaultCodeType[] | null>(defaultCodeMap);
  const [previousProblem, setPreviousProblem] = useState<number>(0);

  useEffect(() => {
    setCurrentLanguage(defaultLanguage);
  }, [defaultLanguage]);

  useEffect(() => {
    setCodeMap(defaultCodeMap);
  }, [defaultCodeMap]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    setCodeEditor(editor);
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });
  };

  const handleEditorWillMount = (editor: typeof monaco) => {
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
      const codeMapTemp = codeMap;
      codeMapTemp[currentProblem][currentLanguage] = codeEditor.getValue();
      setCodeMap(codeMapTemp);
      codeEditor.setValue(codeMap[currentProblem][language]);
    }

    // Change the language and initial code for the editor
    setCurrentLanguage(language);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  useEffect(() => {
    if (codeMap != null && codeEditor != null) {
      if (codeMap[currentProblem] != null) {
        const codeMapTemp = codeMap;

        if (codeEditor.getValue() !== 'Loading...') {
          codeMapTemp[previousProblem][currentLanguage] = codeEditor.getValue();
        }

        setCodeMap(codeMapTemp);
        setPreviousProblem(currentProblem);

        let newLanguage = currentLanguage;

        if (getCurrentLanguage !== null) {
          newLanguage = getCurrentLanguage();

          if (newLanguage !== currentLanguage) {
            setCurrentLanguage(newLanguage);
          }
        }

        codeEditor.setValue(codeMap[currentProblem][newLanguage]);
      }
    }
  }, [currentLanguage, codeMap, codeEditor, setCodeEditor, currentProblem, previousProblem, getCurrentLanguage]);

  return (
    <Content>
      <LanguageContainer>
        <LanguageSelect
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          value={currentLanguage}
          disabled={!onLanguageChange}
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
          options={{ ...monacoEditorOptions, readOnly: !onCodeChange }}
          theme="default-theme"
          height="100%"
          editorDidMount={handleEditorDidMount}
          editorWillMount={handleEditorWillMount}
          onChange={() => onCodeChange && onCodeChange(codeEditor?.getValue() || 'Loading...')}
          language={languageToEditorLanguage(currentLanguage)}
          defaultValue={defaultCode || 'Loading...'}
        />
      </EditorContainer>
    </Content>
  );
}

export default ResizableMonacoEditor;
