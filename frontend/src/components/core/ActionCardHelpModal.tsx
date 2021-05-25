import React from 'react';
import styled from 'styled-components';
import { LargeText, Text } from './Text';
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
        <LargeText>Terminology</LargeText>
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
      </LeftContainer>
    </Modal>
  );
}

export default ActionCardHelpModal;
