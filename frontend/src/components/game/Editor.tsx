import React, { useContext, useEffect, useState } from 'react';
import MonacoEditor, { EditorConstructionOptions } from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styled, { ThemeContext } from 'styled-components';
import Language, { fromString, languageToEditorLanguage } from '../../api/Language';
import { DefaultCodeType } from '../../api/Problem';

/**
 * onLanguageChange - a callback, called when the currentLanguage changes
 * onCodeChange - a callback, called when the code changes
 * getCurrentLanguage - a function passed in, which can be called to get the current language
 * defaultCodeMap - a map of all the default code for each problem and language
 * currentProblem - the problem which is current being worked on
 * liveCode - a string used for spectator view
 */
type EditorProps = {
  onLanguageChange: ((language: Language) => void) | null,
  onCodeChange: ((code: string) => void) | null,
  getCurrentLanguage: (() => Language) | null,
  defaultCodeMap: DefaultCodeType[] | null,
  defaultCode: string | null,
  currentProblem: number,
  liveCode: string | null,
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
  fontFamily: 'Monaco, monospace',
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
    onLanguageChange, onCodeChange, getCurrentLanguage,
    defaultCodeMap, defaultCode, currentProblem, liveCode,
  } = props;

  const theme = useContext(ThemeContext);
  const [codeEditor, setCodeEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [codeMap, setCodeMap] = useState<DefaultCodeType[] | null>(defaultCodeMap);
  const [previousProblem, setPreviousProblem] = useState<number>(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Java);

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

  const handleCodeChange = () => {
    if (onCodeChange) {
      onCodeChange(codeEditor?.getValue() || '');
    }
  };

  // When spectating, clear any extraneous selections that occur when code changes
  useEffect(() => {
    if (codeEditor) {
      codeEditor.setSelection(new monaco.Selection(0, 0, 0, 0));
    }
  }, [codeEditor, liveCode]);

  const handleLanguageChange = (language: Language) => {
    // Save the code for this language
    if (codeMap != null && codeEditor != null) {
      const codeMapTemp = codeMap;
      codeMapTemp[currentProblem][currentLanguage] = codeEditor.getValue();
      setCodeMap(codeMapTemp);
      codeEditor.setValue(codeMap[currentProblem][language]);
    }

    // Call onLanguageChange
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  // This hook will be called if the user switches the problem he or she is working on
  useEffect(() => {
    if (codeMap != null && codeEditor != null) {
      if (codeMap[currentProblem] != null) {
        const codeMapTemp = codeMap;

        // If the value of the editor is not "Loading...", save it in the codeMap
        if (codeEditor.getValue() !== 'Loading...') {
          codeMapTemp[previousProblem][currentLanguage] = codeEditor.getValue();
        }

        setCodeMap(codeMapTemp);
        setPreviousProblem(currentProblem);

        // If getCurrentLanguage is defined, set currentLanguage to the returned value,
        // which is the language that was last used for the new problem,
        // and set the CodeEditor to be the code for the problem and language
        if (getCurrentLanguage) {
          setCurrentLanguage(getCurrentLanguage());
          codeEditor.setValue(codeMap[currentProblem][getCurrentLanguage()]);
        } else {
          codeEditor.setValue(codeMap[currentProblem][currentLanguage]);
        }
      }
    }
  }, [currentLanguage, codeMap, codeEditor, setCodeEditor, getCurrentLanguage,
    currentProblem, previousProblem]);

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
          onChange={handleCodeChange}
          language={languageToEditorLanguage(currentLanguage)}
          defaultValue={defaultCode || 'Loading...'}
          value={liveCode}
        />
      </EditorContainer>
    </Content>
  );
}

export default ResizableMonacoEditor;
