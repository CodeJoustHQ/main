import React from 'react';
import styled from 'styled-components';
import { Player } from '../../api/Game';
import Language from '../../api/Language';
import { useBestSubmission } from '../../util/Hook';
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
  player: Player,
}

function PreviewCodeContent(props: PreviewCodeContentProps) {
  const { player } = props;

  const bestSubmission = useBestSubmission(player);

  if (!player || !player.submissions.length) {
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
          codeMap={null}
          defaultLanguage={bestSubmission?.language as Language || Language.Python}
          defaultCode={bestSubmission?.code || 'Uh oh! An error occurred fetching this player\'s code'}
        />
      </CodePreview>
    </div>
  );
}

export default PreviewCodeContent;
