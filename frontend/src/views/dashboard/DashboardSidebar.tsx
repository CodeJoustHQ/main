import React from 'react';
import styled from 'styled-components';
import { DashboardTab } from './Dashboard';
import { NoMarginSubtitleText } from '../../components/core/Text';
import { PrimaryButtonLink, TextLink } from '../../components/core/Link';

type DashboardSidebarProps = {
  tab: DashboardTab,
  onClick: (tab: DashboardTab) => void,
};

type TabItemProps = {
  active: boolean,
  onClick: (tab: DashboardTab) => void,
  enabled?: boolean,
};

const Content = styled.div`
  position: relative;
  width: 300px;
  text-align: left;
  display: flex;
  flex-direction: column;
  
  // [Header: height + padding] + [Dashboard: margin-top] + desired padding-bottom
  height: calc(100vh - 130px);
  min-height: 20rem;
`;

const InnerContent = styled.div`
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
  flex: 1;
`;

const BottomContent = styled.div`
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
`;

const DashboardText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.darkText};
  margin: 4px 15px;
`;

const TabItem = styled.div<TabItemProps>`
  background-color: ${({ theme, active }) => (active ? theme.colors.background : theme.colors.white)};
  border-radius: 6px;
  padding: 8px;
  cursor: ${({ enabled }) => (enabled === false ? 'default' : 'pointer')};
  
  &:hover {
    background-color: ${({ theme, enabled }) => (enabled === false ? theme.colors.white : theme.colors.background)};
  }
`;

const NewGameLink = styled(PrimaryButtonLink)`
  margin: 5px auto;
  width: 80%;
`;

function DashboardSidebar(props: DashboardSidebarProps) {
  const { tab, onClick } = props;

  return (
    <Content>
      <DashboardText>Dashboard</DashboardText>
      <InnerContent>
        <TabItem
          active={tab === DashboardTab.PROBLEMS}
          onClick={() => onClick(DashboardTab.PROBLEMS)}
        >
          <NoMarginSubtitleText>Problems</NoMarginSubtitleText>
        </TabItem>
        <TabItem
          active={tab === DashboardTab.GAME_HISTORY}
          onClick={() => 'do nothing for now (not implemented)'}
          enabled={false}
        >
          <NoMarginSubtitleText>Game History (soon!)</NoMarginSubtitleText>
        </TabItem>
        <TabItem
          active={tab === DashboardTab.SUGGEST_FEATURE}
          onClick={() => window.open('https://airtable.com/shrGkEhC6RhAxRCxG', '_blank')}
        >
          <NoMarginSubtitleText>Suggest a Feature</NoMarginSubtitleText>
        </TabItem>
      </InnerContent>

      <BottomContent>
        <NewGameLink to="/game/create">Start New Game</NewGameLink>
        <br />
        <TextLink to="/game/join">
          Or join a room &#8594;
        </TextLink>
      </BottomContent>
    </Content>
  );
}

export default DashboardSidebar;
