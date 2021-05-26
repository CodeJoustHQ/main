import React from 'react';
import styled from 'styled-components';
import { Player, Submission } from '../../api/Game';
import Language from '../../api/Language';
import { SecondaryHeaderText } from '../core/Text';
import ResizableMonacoEditor from '../game/Editor';

const CodePreview = styled.div`
  position: relative;
  text-align: left;
  margin: 10px auto;
  
  width: 75%;
  height: 45vh;
  padding: 8px 0;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.blue};
  border-radius: 8px;
`;

type PreviewCodeContentProps = {
  players: Player[],
  playerIndex: number,
}

function PreviewCodeContent(props: PreviewCodeContentProps) {
  const { players, playerIndex } = props;

  if (!players[playerIndex] || !players[playerIndex].submissions.length) {
    return null;
  }

  let bestSubmission: Submission | undefined;
  players[playerIndex].submissions.forEach((submission) => {
    if (!bestSubmission || submission.numCorrect > bestSubmission.numCorrect) {
      bestSubmission = submission;
    }
  });

  return (
    <div>
      <SecondaryHeaderText bold>
        {`Previewing code for player "${players[playerIndex].user.nickname}"`}
      </SecondaryHeaderText>
      <CodePreview>
        <ResizableMonacoEditor
          onLanguageChange={null}
          onCodeChange={null}
          codeMap={null}
          defaultLanguage={bestSubmission?.language as Language || Language.Python}
          defaultCode={bestSubmission?.code || 'Uh oh! An error occurred fetching this player\'s code'}
        />
      </CodePreview>
    </div>
  );
}

export default PreviewCodeContent;
