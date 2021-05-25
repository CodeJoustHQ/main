import React from 'react';
import styled from 'styled-components';
import { LargeText, NoMarginMediumText, Text } from './Text';
import { LeftContainer } from './Container';
import Modal from './Modal';

const ActionCardHelpText = styled(Text)`
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

type ActionCardHelpModalProps = {
  show: boolean,
  exitModal: () => void,
};

function ActionCardHelpModal(props: ActionCardHelpModalProps) {
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
          <ActionCardHelpText>
            <b>Overview</b>
            : The lobby page is where you invite players to the room, and update
            the player and room settings. New players can join the room using
            the link of the form codejoust.co/play?room=ROOM_ID, or by going to
            codejoust.co/play and entering that same Room ID.
          </ActionCardHelpText>
        </div>
        <NoMarginMediumText>Player Settings</NoMarginMediumText>
        <div>
          <ActionCardHelpText>
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
          </ActionCardHelpText>
        </div>
        <div>
          <ActionCardHelpText>
            <InlineIcon>flag</InlineIcon>
            <b>host</b>
            : Every room has one host, and they control the room settings,
            user settings, and the ability to start the game. They can
            transfer the host role to any other connected user in the room.
          </ActionCardHelpText>
        </div>
        <div>
          <ActionCardHelpText>
            <InlineIcon>visibility</InlineIcon>
            <b>spectator</b>
            : The spectator attribute determines whether the user is an active
            player in the game, or simply spectating it. By default, the host
            is a spectator in the game, but they can change this setting.
          </ActionCardHelpText>
        </div>
        <NoMarginMediumText>Room Settings</NoMarginMediumText>
        <div>
          <ActionCardHelpText>
            <b>Selected Problems</b>
            : The selected problems are the problems that the players must solve
            during the game. Currently, this feature is optional: only one
            problem is allowed, and if none is selected then a random one is
            chosen with the provided difficulty setting when the game starts. However, in the future, these will be the only problems in the game.
          </ActionCardHelpText>
        </div>
        <div>
          <ActionCardHelpText>
            <b>Difficulty</b>
            : The difficulty setting currently filters the random problem
            chosen by this difficulty. However, in the future, this will be
            used to filter the selected problems widget for problems only of
            that difficulty.
          </ActionCardHelpText>
        </div>
        <div>
          <ActionCardHelpText>
            <b>Selected Tags</b>
            : The selected tags currently allows the user to search and select
            certain tags, but does not yet have an impact on game settings.
            However, in the future, this will be used to filter the selected
            problems widget for problems only with those tags.
          </ActionCardHelpText>
        </div>
        <div>
          <ActionCardHelpText>
            <b>Duration</b>
            : The duration sets the maximum amount of time the game will last
            before it ends. The default value is fifteen minutes, the minimum
            value is one minute, and the maximum value is one hour.
          </ActionCardHelpText>
        </div>
        <div>
          <ActionCardHelpText>
            <b>Room Size</b>
            : The room size setting allows the host to control the maximum
            amount of users that can join the room. The default value is ten,
            and no room can have more than thirty users.
          </ActionCardHelpText>
        </div>
      </LeftContainer>
    </Modal>
  );
}

export default ActionCardHelpModal;
