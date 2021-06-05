import copy from 'copy-to-clipboard';
import React, { useCallback, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import MarkdownEditor from 'rich-markdown-editor';
import { Message, Subscription } from 'stompjs';
import styled from 'styled-components';
import { SpectateGame } from '../../api/Game';
import Language from '../../api/Language';
import { routes, send, subscribe } from '../../api/Socket';
import { useAppSelector } from '../../util/Hook';
import { getDifficultyDisplayButton, PrimaryButton } from '../core/Button';
import { CenteredContainer, Panel, SplitterContainer } from '../core/Container';
import ErrorMessage from '../core/Error';
import Loading from '../core/Loading';
import Modal from '../core/Modal';
import { BottomFooterText, LargeCenterText, ProblemHeaderText } from '../core/Text';
import PreviewCodeContent from '../results/PreviewCodeContent';
import ResultsTable from '../results/ResultsTable';
import {
  BottomCopyIndicatorContainer,
  CopyIndicator,
  SmallInlineCopyIcon,
  SmallInlineCopyText,
} from '../special/CopyIndicator';
import Editor from './Editor';

const StyledMarkdownEditor = styled(MarkdownEditor)`
  margin-top: 15px;
  padding: 0;
  
  p {
    font-family: ${({ theme }) => theme.font};
  }

  // The specific list of attributes to have dark text color.
  .ProseMirror > p, blockquote, h1, h2, h3, ul, ol, table {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const OverflowPanel = styled(Panel)`
  overflow-y: auto;
  height: 100%;
  padding: 0 25px;
`;

const NoPaddingPanel = styled(Panel)`
  padding: 0;
`;

function SpectatorGameView() {
  const { currentUser, game } = useAppSelector((state) => state);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [codeModal, setCodeModal] = useState(-1);
  const [playerSocket, setPlayerSocket] = useState<Subscription | null>();
  const [spectateGame, setSpectateGame] = useState<SpectateGame | null>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Unsubscribe from the player socket.
  const unsubscribePlayer = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    playerSocket?.unsubscribe();
    setSpectateGame(null);
  }, [playerSocket]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePlayer = useCallback((roomIdParam: string, userIdParam: string) => {
    setLoading(true);

    // If the spectator is currently subscribed, unsubscribe them.
    if (playerSocket) {
      unsubscribePlayer();
    }

    // Update the spectate view based on player activity.
    const subscribePlayerCallback = (result: Message) => {
      if (!JSON.parse(result.body).newSpectator) {
        const updatedSpectateGame: SpectateGame = JSON.parse(result.body);
        setSpectateGame(updatedSpectateGame);
      }
    };

    subscribe(routes(roomIdParam, userIdParam).subscribe_player, subscribePlayerCallback)
      .then((subscription) => {
        setPlayerSocket(subscription);

        // Send socket message to inform player new spectator is present.
        const newSpectator: string = JSON.stringify({
          newSpectator: true,
        });
        send(routes(roomIdParam, userIdParam).subscribe_player, {}, newSpectator);
        setError('');
      }).catch((err) => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [playerSocket, unsubscribePlayer]);

  const closeModal = () => {
    setCodeModal(-1);
    unsubscribePlayer();
  };

  // Creates Event when splitter bar is dragged
  const onSecondaryPanelSizeChange = () => {
    const event = new Event('secondaryPanelSizeChange');
    window.dispatchEvent(event);
  };

  // Display the spectate player view if currently viewing another player.
  if (playerSocket && spectateGame) {
    return (
      <>
        <p>
          Spectate
          {' '}
          {spectateGame?.player.nickname}
        </p>

        <PrimaryButton onClick={unsubscribePlayer}>
          Go Back
        </PrimaryButton>

        {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
        <SplitterContainer>
          <SplitterLayout
            onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
            percentage
            primaryMinSize={20}
            secondaryMinSize={35}
          >
            {/* Problem title/description panel */}
            <OverflowPanel className="display-box-shadow">
              <ProblemHeaderText>{spectateGame?.problem.name}</ProblemHeaderText>
              {
                spectateGame?.problem ? (
                  getDifficultyDisplayButton(spectateGame?.problem.difficulty!)
                ) : null
              }
              <StyledMarkdownEditor
                defaultValue={spectateGame?.problem.description}
                value={spectateGame?.problem.description}
                onChange={() => ''}
                readOnly
              />
              <BottomFooterText>
                {'Notice an issue? Contact us at '}
                <SmallInlineCopyText
                  onClick={() => {
                    copy('support@codejoust.co');
                    setCopiedEmail(true);
                  }}
                >
                  support@codejoust.co
                  <SmallInlineCopyIcon>content_copy</SmallInlineCopyIcon>
                </SmallInlineCopyText>
              </BottomFooterText>
            </OverflowPanel>

            {/* Code editor */}
            <NoPaddingPanel className="display-box-shadow">
              <Editor
                onLanguageChange={null}
                onCodeChange={null}
                codeMap={null}
                defaultLanguage={spectateGame?.language as Language || Language.Java}
                defaultCode={spectateGame?.code || 'Uh oh! An error occurred fetching this player\'s code'}
                liveCode={spectateGame?.code || null}
              />
            </NoPaddingPanel>
          </SplitterLayout>
        </SplitterContainer>
        <BottomCopyIndicatorContainer copied={copiedEmail}>
          <CopyIndicator onClick={() => setCopiedEmail(false)}>
            Email copied!&nbsp;&nbsp;✕
          </CopyIndicator>
        </BottomCopyIndicatorContainer>
      </>
    );
  }

  return (
    <>
      <Modal show={codeModal !== -1} onExit={closeModal} fullScreen>
        <PreviewCodeContent
          player={game?.players[codeModal]}
        />
      </Modal>
      <LargeCenterText>Live Scoreboard</LargeCenterText>
      <ResultsTable
        players={game?.players || []}
        currentUser={currentUser}
        gameStartTime={game?.gameTimer.startTime || ''}
        viewPlayerCode={(index: number) => setCodeModal(index)}
        spectatePlayer={(index: number) => {
          if (game) {
            subscribePlayer(game.room.roomId, game.players[index].user.userId!);
          }
        }}
      />
      {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
      {loading ? <CenteredContainer><Loading /></CenteredContainer> : null}
    </>
  );
}

export default SpectatorGameView;
