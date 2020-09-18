import React, { ComponentProps } from 'react';
import MonacoEditor from 'react-monaco-editor';

type EditorProps = ComponentProps<typeof MonacoEditor>

function ResizableMonacoEditor(props: EditorProps) {
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
