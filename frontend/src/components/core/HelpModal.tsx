import React from 'react';
import styled from 'styled-components';
import { LargeText, NoMarginMediumText, Text } from './Text';
import { LeftContainer } from './Container';
import Modal from './Modal';

const HelpText = styled(Text)`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
`;

type PlayerIconType = {
  isActive: boolean,
};

const ActionCardActiveIcon = styled.div<PlayerIconType>`
  display: inline-block;
  margin-right: 5px;
  background: ${({ theme, isActive }) => (isActive ? theme.colors.gradients.green : theme.colors.gradients.red)};
  border-radius: 0.5rem;
  height: 0.8rem;
  width: 0.8rem;
`;

const InlineIcon = styled.i.attrs(() => ({
  className: 'material-icons',
}))`
  margin-right: 5px;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
`;

type HelpModalProps = {
  show: boolean,
  exitModal: () => void,
};

export function LobbyHelpModal(props: HelpModalProps) {
  // Grab props variables.
  const {
    show, exitModal,
  } = props;

  return (
    <Modal
      show={show}
      onExit={exitModal}
      fullScreen
    >
      <LeftContainer>
        <LargeText>Help Section</LargeText>
        <NoMarginMediumText>Lobby Page</NoMarginMediumText>
        <div>
          <HelpText>
            <b>Overview</b>
            : The lobby page is where you invite players to the room, and update
            the player and room settings. New players can join the room using
            the link of the form codejoust.co/play?room=ROOM_ID, or by going to
            codejoust.co/play and entering that same Room ID.
          </HelpText>
        </div>
        <NoMarginMediumText>Player Settings</NoMarginMediumText>
        <div>
          <HelpText>
            <ActionCardActiveIcon isActive />
            <b>active</b>
            {' '}
            and
            {' '}
            <ActionCardActiveIcon isActive={false} />
            <b>inactive</b>
            : These attributes show the user&apos;s current connection status.
            Active means the user can send and receive room updates, while
            inactive means they cannot and are connecting or have the tab
            closed.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <InlineIcon>flag</InlineIcon>
            <b>host</b>
            : Every room has one host, and they control the room settings,
            user settings, and the ability to start the game. They can
            transfer the host role to any other connected user in the room.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <InlineIcon>visibility</InlineIcon>
            <b>spectator</b>
            : The spectator attribute determines whether the user is an active
            player in the game, or simply spectating it. By default, the host
            is a spectator in the game, but they can change this setting.
          </HelpText>
        </div>
        <NoMarginMediumText>Room Settings</NoMarginMediumText>
        <div>
          <HelpText>
            <b>Selected Problems</b>
            : The selected problems are the problems that the players must solve
            during the game. Currently, this feature is optional: only one
            problem is allowed, and if none are selected then a random one is
            chosen with the provided difficulty setting when the game starts.
            In the future, these will be the only problems in the game.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Difficulty</b>
            : The difficulty setting currently filters the random problems
            chosen by this difficulty. In the future, this will be
            used to filter the selected problems.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Selected Tags</b>
            : The selected tags currently allows the user to search and select
            certain tags, but does not yet have an impact on game settings.
            In the future, this will be used to filter the selected problems.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Duration</b>
            : The duration sets the maximum amount of time the game will last
            before it ends. The default value is fifteen minutes, the minimum
            value is one minute, and the maximum value is one hour.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Room Size</b>
            : The room size setting allows the host to control the maximum
            amount of users that can join the room. The default value is ten,
            and no room can have more than thirty users.
          </HelpText>
        </div>
      </LeftContainer>
    </Modal>
  );
}

export function ProblemHelpModal(props: HelpModalProps) {
  // Grab props variables.
  const {
    show, exitModal,
  } = props;

  return (
    <Modal
      show={show}
      onExit={exitModal}
      fullScreen
    >
      <LeftContainer>
        <LargeText>Help Section</LargeText>
        <NoMarginMediumText>Problem Page</NoMarginMediumText>
        <div>
          <HelpText>
            <b>Overview</b>
            : You can view a complete example problem here at http://codejoust.co/problem/791d34a1-5525-4a33-95c3-d604fef6c94d.
          </HelpText>
        </div>
        <NoMarginMediumText>Options</NoMarginMediumText>
        <div>
          <HelpText>
            <b>Difficulty</b>
            : The difficulty setting currently filters the random problems
            chosen by this difficulty. In the future, this will be
            used to filter the selected problems.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Tags</b>
            : The selected tags currently allows the user to search and select
            certain tags, but does not yet have an impact on game settings.
            In the future, this will be used to filter the selected problems.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Problem Inputs</b>
            : ...
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Problem Output</b>
            : ...
          </HelpText>
        </div>
      </LeftContainer>
    </Modal>
  );
}
