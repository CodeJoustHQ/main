import React from 'react';
import styled from 'styled-components';
import { LargeText, NoMarginMediumText, Text } from './Text';
import { LeftContainer } from './Container';
import Modal from './Modal';
import { InlineExternalLink } from './Link';

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
            : The problem page is where you can create or edit your problems,
            as well as preview problems created by others. Be sure to save
            any changes before leaving the page! You can view a
            {' '}
            <InlineExternalLink href="/problem/791d34a1-5525-4a33-95c3-d604fef6c94d" target="_blank">
              complete problem
            </InlineExternalLink>
            {' '}
            created by the CodeJoust team to see an example.
          </HelpText>
        </div>
        <NoMarginMediumText>Options</NoMarginMediumText>
        <div>
          <HelpText>
            <b>Approved or Approval Pending</b>
            : The Approved or Approval Pending toggle allows the user to
            determine when the problem is ready to be used in games. In the
            future, this feature will likely be discontinued and replaced with
            a more robust public, private, and verified problem system.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Difficulty and Tags</b>
            : The difficulty and tags settings add more information to the
            problem, and allow users to filter their collection to find
            relevant problems.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Problem Inputs</b>
            : Every problem is structured in the form of a method with
            parameters and a return type, and the problem inputs and their
            names are added here. There are some restrictions on valid names
            (no spaces or special characters).
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Problem Output</b>
            : The problem output type is defined here. Further types may be
            added in the future; if you have any requests, please
            {' '}
            <InlineExternalLink href="/contact-us" target="_blank">
              contact us
            </InlineExternalLink>
            .
          </HelpText>
        </div>
        <NoMarginMediumText>Test Cases</NoMarginMediumText>
        <div>
          <HelpText>
            <b>Input</b>
            : The Input is the first required setting for test cases. Each line
            represents the next parameter, in order. This means that
            Strings cannot have newlines - special characters are also not
            allowed. This input must perfectly match the parameters selected
            in Problem Inputs.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Output</b>
            : The Output should be just one line, which must have the same form
            as the Problem Output type selected under Options.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Explanation</b>
            : The Explanation is an optional field that is not currently in use
            on the game page, but may be used in the future to help players
            understand the test case. The CodeJoust team suggests you only add
            an explanation for the first test case.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Hidden</b>
            : The Hidden toggle determines whether the player will be able
            to see the contents of the test case when coding. We suggest making
            at least one non-hidden test case, and at least one hidden test
            case.
          </HelpText>
        </div>
        <div>
          <HelpText>
            <b>Ordering</b>
            : The test cases can be ordered by simply dragging them higher or
            lower. This simply impacts which test cases the player will see
            first when they are solving a problem.
          </HelpText>
        </div>
      </LeftContainer>
    </Modal>
  );
}
