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
  const { show, exitModal } = props;

  return (
    <Modal
      show={show}
      onExit={exitModal}
      fullScreen
    >
      <LeftContainer>
        <LargeText>Help Section</LargeText>
        <NoMarginMediumText>Lobby Page</NoMarginMediumText>
        <>
          <HelpText>
            <b>Overview</b>
            : The lobby page is where you invite players to the room, and update
            the player and room settings. New players can join the room using
            the link of the form codejoust.co/play?room=ROOM_ID, or by going to
            codejoust.co/play and entering that same Room ID.
          </HelpText>
        </>
        <NoMarginMediumText>Player Settings</NoMarginMediumText>
        <>
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
        </>
        <>
          <HelpText>
            <InlineIcon>flag</InlineIcon>
            <b>host</b>
            : Every room has one host, and they control the room settings,
            user settings, and the ability to start the game. They can
            transfer the host role to any other connected user in the room.
          </HelpText>
        </>
        <>
          <HelpText>
            <InlineIcon>visibility</InlineIcon>
            <b>spectator</b>
            : The spectator attribute determines whether the user is an active
            player in the game, or simply spectating it. By default, the host
            is a spectator in the game, but they can change this setting.
          </HelpText>
        </>
        <NoMarginMediumText>Room Settings</NoMarginMediumText>
        <>
          <HelpText>
            <b>Selected Problems</b>
            : The selected problems are the problems that the players must solve
            during the game. The host can specify which problems they want to use
            (from either their own or CodeJoust&apos;s public collection).
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Difficulty</b>
            : If no problems are selected, the host can choose a difficulty setting
            and play the game with a randomly selected problem.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Number of Problems</b>
            : If no problems are manually chosen, the host can choose how many problems
            they want to be randomly selected for the game.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Duration</b>
            : The duration sets the maximum amount of time the game will last
            before it ends. The default value is fifteen minutes, the minimum
            value is one minute, and the maximum value is one hour.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Room Size</b>
            : The room size setting allows the host to control the maximum
            amount of users that can join the room. The default value is ten,
            and no room can have more than thirty users.
          </HelpText>
        </>
      </LeftContainer>
    </Modal>
  );
}

export function ProblemHelpModal(props: HelpModalProps) {
  const { show, exitModal } = props;

  return (
    <Modal
      show={show}
      onExit={exitModal}
      fullScreen
    >
      <LeftContainer>
        <LargeText>Help Section</LargeText>
        <NoMarginMediumText>Problem Page</NoMarginMediumText>
        <>
          <HelpText>
            <b>Overview</b>
            : The problem page is where you can create or edit your problems,
            as well as preview problems created by others. Be sure to
            <i> save any changes </i>
            before leaving the page! You can view a
            {' '}
            <InlineExternalLink href="/problem/791d34a1-5525-4a33-95c3-d604fef6c94d" target="_blank">
              complete problem
            </InlineExternalLink>
            {' '}
            created by the CodeJoust team to see an example.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Description</b>
            : The problem description uses a Markdown editor, meaning you can
            add headings, lists, tables, quotes, code, links, and much more. You
            can customize this however you wish, or use the default template
            description provided by the CodeJoust team.
          </HelpText>
        </>
        <NoMarginMediumText>Options</NoMarginMediumText>
        <>
          <HelpText>
            <b>Difficulty and Tags</b>
            : The difficulty and tags settings add more information to the
            problem, and allow users to filter their collection to find
            relevant problems. Tags can only be added once the problem has
            been created.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Problem Inputs</b>
            : Every problem is structured in the form of a method with
            parameters and a return type, and the problem inputs and their
            names are added here. There are some restrictions on valid names
            (no spaces or special characters).
          </HelpText>
        </>
        <>
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
        </>
        <NoMarginMediumText>Test Cases</NoMarginMediumText>
        <>
          <HelpText>
            <b>Overview</b>
            : Test cases are how this platform judges the accuracy of problem
            solutions. These can only be added once the initial problem was
            created.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Input</b>
            : The Input is the first required setting for test cases. Each line
            represents the next parameter, in order. This means that
            Strings cannot have newlines - special characters are also not
            allowed. The input must perfectly match the parameters selected
            in Problem Inputs.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Output</b>
            : The Output is the second required setting for test cases.
            The Output should be just one line, and must perfectly match the
            type selected in Problem Output.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Explanation</b>
            : The Explanation is an optional field that is not currently in use
            on the game page, but may be used in the future to help players
            understand the test case. The CodeJoust team suggests you only add
            an explanation for the first test case.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Hidden</b>
            : The Hidden toggle determines whether the player will be able
            to see the contents of the test case when coding. We suggest making
            at least one non-hidden test case, and at least one hidden test
            case.
          </HelpText>
        </>
        <>
          <HelpText>
            <b>Ordering</b>
            : The test cases can be ordered by simply dragging them higher or
            lower. This simply impacts which test cases the player will see
            first when they are solving a problem.
          </HelpText>
        </>
      </LeftContainer>
    </Modal>
  );
}
