import React from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';

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
