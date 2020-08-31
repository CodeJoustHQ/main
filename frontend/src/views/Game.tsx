import Editor from '@monaco-editor/react';
import React from 'react';

function GamePage() {
  return (
    <div>
      Game page
      <Editor height="90vh" language="javascript" />
    </div>
  );
}

export default GamePage;
