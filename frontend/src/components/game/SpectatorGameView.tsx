/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import SplitterLayout from 'react-splitter-layout';
import { Message, Subscription } from 'stompjs';
import { Game, Player, SpectateGame } from '../../api/Game';
import { routes, subscribe } from '../../api/Socket';
import { useAppSelector } from '../../util/Hook';
import { CenteredContainer, SplitterContainer } from '../core/Container';
import ErrorMessage from '../core/Error';
import Modal from '../core/Modal';
import { LargeCenterText } from '../core/Text';
import PreviewCodeContent from '../results/PreviewCodeContent';
import ResultsTable from '../results/ResultsTable';

function SpectatorGameView() {
  const { currentUser, game } = useAppSelector((state) => state);

  const [codeModal, setCodeModal] = useState(-1);
  const [playerSocket, setPlayerSocket] = useState<Subscription | null>();
  const [spectateGame, setSpectateGame] = useState<SpectateGame | null>();
  const [error, setError] = useState<string>('');

  // Unsubscribe from the player socket.
  const unsubscribePlayer = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    playerSocket?.unsubscribe();
    setSpectateGame(null);
  }, [playerSocket]);

  // Re-subscribe in order to get the correct subscription callback.
  const subscribePlayer = useCallback((roomIdParam: string, userIdParam: string) => {
    // If the spectator is currently subscribed, unsubscribe them.
    if (playerSocket) {
      unsubscribePlayer();
    }

    // Update the spectate view based on player activity.
    const subscribePlayerCallback = (result: Message) => {
      const updatedGame: SpectateGame = JSON.parse(result.body);

      // TODO: Include cursor location?
      setSpectateGame(updatedGame);
    };

    subscribe(routes(roomIdParam, userIdParam).subscribe_player, subscribePlayerCallback)
      .then((subscription) => {
        setPlayerSocket(subscription);
      }).catch((err) => {
        setError(err.message);
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
  if (playerSocket) {
    return (
      <>
        <p>
          Spectate
          {' '}
          {spectateGame?.player.nickname}
        </p>

        {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
        <SplitterContainer>
          <SplitterLayout
            onSecondaryPaneSizeChange={onSecondaryPanelSizeChange}
            percentage
            primaryMinSize={20}
            secondaryMinSize={35}
            customClassName="game-splitter-container"
          >
            {/* Problem title/description panel */}
            <OverflowPanel className="display-box-shadow">
              <ProblemHeaderText>{game?.problems[0]?.name}</ProblemHeaderText>
              {game?.problems[0] ? (
                <DifficultyDisplayButton
                  difficulty={game?.problems[0].difficulty!}
                  enabled={false}
                  active
                >
                  {displayNameFromDifficulty(game?.problems[0].difficulty!)}
                </DifficultyDisplayButton>
              ) : null}
              <StyledMarkdownEditor
                defaultValue={game?.problems[0]?.description}
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
            <NoPaddingPanel>
              <Editor
                onCodeChange={setCurrentCode}
                onLanguageChange={setCurrentLanguage}
                codeMap={defaultCodeList[0]}
                defaultLanguage={currentLanguage}
                defaultCode={null}
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
        viewPlayerCode={(index: number) => {
          if (game) {
            subscribePlayer(game.room.roomId, game.players[index].user.userId!);
          }
          setCodeModal(index);
        }}
      />
      {error ? <CenteredContainer><ErrorMessage message={error} /></CenteredContainer> : null}
    </>
  );
}

export default SpectatorGameView;
