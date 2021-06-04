import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { useLocation, useHistory } from 'react-router-dom';
import { Message } from 'stompjs';
import { unwrapResult } from '@reduxjs/toolkit';
import { LargeText, MainHeaderText } from '../components/core/Text';
import { Game, Player, playAgain } from '../api/Game';
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
import { useAppDispatch, useAppSelector } from '../util/Hook';
import { fetchGame, setGame } from '../redux/Game';
import { setCurrentUser } from '../redux/User';
import { setRoom } from '../redux/Room';
import PreviewCodeContent from '../components/results/PreviewCodeContent';

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

const PrimaryButtonHoverElement = styled(HoverElement)`
  width: 12rem;
  height: 3rem;
  top: 1.2rem;
  left: 1.2rem;
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InviteContainer = styled.div`
  width: 60%;
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

const PlaceContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const [host, setHost] = useState<User | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [roomId, setRoomId] = useState('');

  const [connected, setConnected] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [hoverVisible, setHoverVisible] = useState<boolean>(false);
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  const [codeModal, setCodeModal] = useState(-1);
  const [placeModal, setPlaceModal] = useState(-1);
  const [displayPlaceModal, setDisplayPlaceModal] = useState(true);

  const dispatch = useAppDispatch();
  const { game } = useAppSelector((state) => state);
  const { currentUser } = useAppSelector((state) => state);

  useEffect(() => {
    if (game) {
      setRoomId(game.room.roomId);
      setHost(game.room.host);
      setStartTime(game.gameTimer.startTime);
      setPlayers(game.players);

      if (game.playAgain && currentUser) {
        disconnect()
          .then(() => {
            dispatch(setRoom(null));
            dispatch(setGame(null));
            history.replace(`/game/lobby?room=${game.room.roomId}`, {
              user: currentUser,
              roomId: game.room.roomId,
            });
          });
      }
    }
  }, [game, currentUser, dispatch, history]);

  useEffect(() => {
    setTimeout(() => setShowFeedbackPrompt(true), 5000);
  }, []);

  useEffect(() => {
    if (checkLocationState(location, 'roomId', 'currentUser')) {
      if (!game || game?.room.roomId !== location.state.roomId) {
        dispatch(fetchGame(location.state.roomId))
          .then(unwrapResult)
          .catch((err) => setError(err.message));
      }
      if (!currentUser) {
        dispatch(setCurrentUser(location.state.currentUser));
      }
    } else {
      history.replace('/game/join', {
        error: errorHandler('Please join and play a game before viewing the results page.'),
      });
    }
  }, [game, currentUser, dispatch, location, history]);

  useEffect(() => {
    if (!connected && roomId && currentUser?.userId) {
      const subscribeCallback = (result: Message) => {
        const updatedGame: Game = JSON.parse(result.body);
        dispatch(setGame(updatedGame));
      };

      connect(roomId, currentUser!.userId!).then(() => {
        subscribe(routes(roomId).subscribe_game, subscribeCallback)
          .then(() => {
            setLoading(false);
            setConnected(true);
            dispatch(fetchGame(roomId))
              .then(unwrapResult)
              .catch((err) => setError(err.message));
          })
          .catch((err) => setError(err.message));
      }).catch((err) => setError(err.message));
    }
  }, [connected, roomId, currentUser, dispatch]);

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

  useEffect(() => {
    players.forEach((player, index) => {
      if (player.user.userId === currentUser?.userId) {
        setPlaceModal(index);
      }
    });
  }, [players, currentUser, setPlaceModal]);

  const getPlaceSubfix = () => {
    const ones = (placeModal + 1) % 10;
    const tenths = (placeModal + 1) % 100;

    if (ones === 1 && tenths !== 11) {
      return 'st';
    }
    if (ones === 2 && tenths !== 12) {
      return 'nd';
    }
    if (ones === 3 && tenths !== 13) {
      return 'rd';
    }

    return 'th';
  };

  // Reset hover status on host changes
  useEffect(() => {
    setHoverVisible(false);
  }, [host]);

  // Content to display for inviting players (if not enough players on the podium)
  const inviteContent = () => (
    <InviteContainer
      onClick={() => {
        copy(`https://codejoust.co/play?room=${roomId}`);
        setCopiedRoomLink(true);
      }}
    >
      <InviteText>
        Invite
        <InlineCopyIcon>content_copy</InlineCopyIcon>
      </InviteText>
    </InviteContainer>
  );

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
      <Modal show={showFeedbackModal} onExit={() => setShowFeedbackModal(false)} fullScreen>
        <FeedbackPopup />
      </Modal>

      <Modal show={codeModal !== -1} onExit={() => setCodeModal(-1)} fullScreen>
        <PreviewCodeContent
          player={players[codeModal]}
        />
      </Modal>

      <Modal
        show={placeModal !== -1 && displayPlaceModal}
        onExit={() => {
          setPlaceModal(-1);
          setDisplayPlaceModal(false);
        }}
        fullScreen
      >
        {placeModal !== -1 ? (
          <PlaceContent>
            <MainHeaderText>
              You placed:
              <b>
                {` ${placeModal + 1}${getPlaceSubfix()}`}
              </b>
              !
            </MainHeaderText>
            <iframe
              title="Airtable feedback form"
              className="airtable-embed"
              src="https://airtable.com/embed/shrGkEhC6RhAxRCxG?backgroundColor=blue"
              frameBorder="0"
              width="80%"
              height="900"
              style={{ background: 'transparent' }}
            />
          </PlaceContent>
        ) : null}
      </Modal>

      <LargeText>Winners</LargeText>
      <PodiumContainer>
        <Podium
          place={2}
          player={players[1]}
          gameStartTime={startTime}
          inviteContent={inviteContent()}
          loading={loading}
          isCurrentPlayer={players[1]?.user.userId === currentUser?.userId}
        />
        <Podium
          place={1}
          player={players[0]}
          gameStartTime={startTime}
          inviteContent={inviteContent()}
          loading={loading}
          isCurrentPlayer={players[0]?.user.userId === currentUser?.userId}
        />
        <Podium
          place={3}
          player={players[2]}
          gameStartTime={startTime}
          inviteContent={inviteContent()}
          loading={loading}
          isCurrentPlayer={players[2]?.user.userId === currentUser?.userId}
        />
      </PodiumContainer>

      <div>
        <HoverContainer>
          <PrimaryButtonHoverElement
            enabled={!loading && isHost(currentUser)}
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
          onClick={() => leaveRoom(dispatch, history, roomId, currentUser)}
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
