import React from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';

export const languages = {
  java: {
    name: 'Java',
    defaultCode:
      'public class Solution {\n\n'
      + '    public static void main(String[] args) {\n'
      + '        \n'
      + '    }\n'
      + '}\n',
  },
  python: {
    name: 'Python',
    defaultCode:
      'def solution():\n'
      + '    \n',
  },
  javascript: {
    name: 'JavaScript',
    defaultCode:
      'function solution() {\n'
      + '    \n'
      + '}\n',
  },
  csharp: {
    name: 'C#',
    defaultCode:
      'using System;\n\n'
      + 'public class Solution\n{\n'
      + '    public static void Main()\n'
      + '    {\n'
      + '        \n'
      + '    }\n'
      + '}\n',
  },
};

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
