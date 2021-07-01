import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import Language from '../../api/Language';
import { SecondaryHeaderText } from '../core/Text';
import ResizableMonacoEditor from '../game/Editor';
import { useBestSubmission } from '../../util/Hook';
import { getBestSubmission } from '../../util/Utility';

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
  player: Player | undefined,
  problemIndex: number,
}

function PreviewCodeContent(props: PreviewCodeContentProps) {
  const { player, problemIndex } = props;

  const bestSubmission = getBestSubmission(player, problemIndex);

  if (player === undefined || !player || !player.submissions.length) {
    return null;
  }

  return (
    <div>
      <SecondaryHeaderText bold>
        {`Previewing code for player "${player.user.nickname}"`}
      </SecondaryHeaderText>
      <CodePreview>
        <ResizableMonacoEditor
          onLanguageChange={null}
          onCodeChange={null}
          getCurrentLanguage={null}
          defaultCodeMap={null}
          currentProblem={0}
          defaultLanguage={bestSubmission?.language as Language || Language.Java}
          defaultCode={bestSubmission?.code || 'Uh oh! An error occurred fetching this player\'s code'}
          liveCode={null}
        />
      </CodePreview>
    </div>
  );
}

export default PreviewCodeContent;
