import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { useLocation, useHistory } from 'react-router-dom';
import { Message } from 'stompjs';
import { LargeText, SecondaryHeaderText } from '../components/core/Text';
import {
  getGame, Game, Player, playAgain, Submission,
} from '../api/Game';
import { checkLocationState, leaveRoom } from '../util/Utility';
import { errorHandler } from '../api/Error';
import { TextButton, PrimaryButton, SecondaryRedButton } from '../components/core/Button';
import ErrorMessage from '../components/core/Error';
import Loading from '../components/core/Loading';
import {
  connect, disconnect, routes, subscribe,
} from '../api/Socket';
import { User } from '../api/User';
import Podium from '../components/results/Podium';
import { HoverContainer, HoverElement, HoverTooltip } from '../components/core/HoverTooltip';
import { Coordinate } from '../components/special/FloatingCircle';
import {
  CopyIndicator,
  CopyIndicatorContainer,
  InlineCopyIcon,
} from '../components/special/CopyIndicator';
import ResultsTable from '../components/results/ResultsTable';
import Modal from '../components/core/Modal';
import FeedbackPopup from '../components/results/FeedbackPopup';
import ResizableMonacoEditor from '../components/game/Editor';
import Language from '../api/Language';

const Content = styled.div`
  padding: 0;
`;

type ShowFeedbackPrompt = {
  show: boolean,
}

const FeedbackButton = styled(TextButton)<ShowFeedbackPrompt>`
  position: fixed;
  top: 50%;
  right: ${({ show }) => (show ? '20px' : '-100px')};
  transition: right 300ms;
`;

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

const PrimaryButtonHoverElement = styled(HoverElement)`
  width: 10rem;
  height: 2.75rem;
  top: 1.2rem;
  left: 1.2rem;
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InviteContainer = styled.div`
  width: 70%;
  margin: 20px auto 0 auto;
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  padding: 5px;
  
  &:hover {
    cursor: pointer;
  }
`;

const InviteText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
`;

type LocationState = {
  roomId: string,
  currentUser: User,
};

function GameResultsPage() {
  const history = useHistory();
  const location = useLocation<LocationState>();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [host, setHost] = useState<User | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [roomId, setRoomId] = useState('');

  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [hoverVisible, setHoverVisible] = useState<boolean>(false);
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  const [codeModal, setCodeModal] = useState(-1);

  useEffect(() => {
    setTimeout(() => setShowFeedbackPrompt(true), 2000);
  }, []);

  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser')) {
      setRoomId(location.state.roomId);
      setCurrentUser(location.state.currentUser);

      // Function that's called when playAgain is triggered
      const playAgainAction = (game: Game) => {
        disconnect()
          .then(() => {
            history.replace(`/game/lobby?room=${game.room.roomId}`, {
              user: location.state.currentUser,
              roomId: game.room.roomId,
            });
          });
      };

      const subscribeCallback = (result: Message) => {
        const updatedGame: Game = JSON.parse(result.body);

        setStartTime(updatedGame.gameTimer.startTime);
        // Update leaderboard with last second submissions
        setPlayers(updatedGame.players);
        // Set new host if the previous host refreshes or leaves
        setHost(updatedGame.room.host);

        // Disconnect users from socket and then redirect them to the lobby page
        if (updatedGame.playAgain) {
          playAgainAction(updatedGame);
        }
      };

      /**
       * Connect, subscribe, and then finally get the game details. Doing so in this order ensures
       * that any late submissions are properly received (either through the socket update or
       * through the get game request) and reflected on the leaderboard.
       */
      connect(location.state.roomId, location.state.currentUser.userId!).then(() => {
        subscribe(routes(location.state.roomId).subscribe_game, subscribeCallback)
          .then(() => {
            // Get latest game information
            getGame(location.state.roomId).then((res) => {
              setLoading(false);
              setPlayers(res.players);
              setHost(res.room.host);
              setStartTime(res.gameTimer.startTime);

              // Check if host elected to play again
              if (res.playAgain) {
                playAgainAction(res);
              }
            }).catch((err) => setError(err.message));
          })
          .catch((err) => setError(err.message));
      }).catch((err) => setError(err.message));
    } else {
      history.replace('/game/join', {
        error: errorHandler('Please join and play a game before viewing the results page.'),
      });
    }
  }, [location, history]);

  const callPlayAgain = () => {
    setError('');
    setLoading(true);

    playAgain(roomId, { initiator: currentUser! })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const isHost = useCallback((user: User | null) => user?.userId === host?.userId, [host]);

  // Get current mouse position.
  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.pageX, y: e.pageY });
  }, [setMousePosition]);

  useEffect(() => {
    window.onmousemove = mouseMoveHandler;
  }, [mouseMoveHandler]);

  // Content to display for inviting players (if not enough players on the podium)
  const inviteContent = () => (
    <InviteContainer>
      <InviteText
        onClick={() => {
          copy(`https://codejoust.co/play?room=${roomId}`);
          setCopiedRoomLink(true);
        }}
      >
        Invite
        <InlineCopyIcon>content_copy</InlineCopyIcon>
      </InviteText>
    </InviteContainer>
  );

  const getPreviewCodeContent = useCallback(() => {
    if (!players[codeModal] || !players[codeModal].submissions.length) {
      return null;
    }

    let bestSubmission: Submission | undefined;
    players[codeModal].submissions.forEach((submission) => {
      if (!bestSubmission || submission.numCorrect > bestSubmission.numCorrect) {
        bestSubmission = submission;
      }
    });

    return (
      <div>
        <SecondaryHeaderText bold>
          {`Previewing code for player "${players[codeModal].user.nickname}"`}
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
  }, [players, codeModal]);

  return (
    <Content>
      <CopyIndicatorContainer copied={copiedRoomLink}>
        <CopyIndicator onClick={() => setCopiedRoomLink(false)}>
          Link copied!&nbsp;&nbsp;✕
        </CopyIndicator>
      </CopyIndicatorContainer>
      <HoverTooltip
        visible={hoverVisible}
        x={mousePosition.x}
        y={mousePosition.y}
      >
        Only the host can restart the room
      </HoverTooltip>

      <FeedbackButton onClick={() => setShowFeedbackModal(true)} show={showFeedbackPrompt}>
        <span role="img" aria-label="wave">Hello! 👋</span>
      </FeedbackButton>
      <Modal show={showFeedbackModal} onExit={() => setShowFeedbackModal(false)}>
        <FeedbackPopup />
      </Modal>

      <Modal show onExit={() => setCodeModal(-1)}>
        {getPreviewCodeContent()}
      </Modal>

      <LargeText>Winners</LargeText>
      <PodiumContainer>
        <Podium
          place={2}
          player={players[1]}
          gameStartTime={startTime}
          inviteContent={inviteContent()}
          loading={loading}
        />
        <Podium
          place={1}
          player={players[0]}
          gameStartTime={startTime}
          inviteContent={inviteContent()}
          loading={loading}
        />
        <Podium
          place={3}
          player={players[2]}
          gameStartTime={startTime}
          inviteContent={inviteContent()}
          loading={loading}
        />
      </PodiumContainer>

      <div>
        <HoverContainer>
          <PrimaryButtonHoverElement
            enabled={isHost(currentUser)}
            onMouseEnter={() => {
              if (!isHost(currentUser)) {
                setHoverVisible(true);
              }
            }}
            onMouseLeave={() => {
              if (!isHost(currentUser)) {
                setHoverVisible(false);
              }
            }}
          />
          <PrimaryButton
            onClick={callPlayAgain}
            disabled={loading || !isHost(currentUser)}
          >
            Play Again
          </PrimaryButton>
        </HoverContainer>

        <SecondaryRedButton
          onClick={() => leaveRoom(history, roomId, currentUser)}
        >
          Leave Room
        </SecondaryRedButton>
      </div>

      { error ? <ErrorMessage message={error} /> : null }
      { loading ? <Loading /> : null }

      <LargeText>Scoreboard</LargeText>
      {players ? (
        <ResultsTable
          players={players}
          currentUser={currentUser}
          gameStartTime={startTime}
          viewPlayerCode={(index: number) => setCodeModal(index)}
        />
      ) : null}
    </Content>
  );
}

export default GameResultsPage;
