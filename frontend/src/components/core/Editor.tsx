import React from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';

// This function refreshes the width of Monaco editor upon change in container size
function ResizableMonacoEditor(props: MonacoEditorProps) {
  const handleEditorDidMount = (editor: any) => {
    window.addEventListener('resize', () => {
      editor.layout();
    });
    window.addEventListener('secondaryPanelSizeChange', () => {
      editor.layout();
    });
  };

  return (
    <MonacoEditor
      {...props}
      editorDidMount={handleEditorDidMount}
    />
  );
}

export default ResizableMonacoEditor;
