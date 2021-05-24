import React from 'react';
import styled from 'styled-components';
import { DashboardTab } from './Dashboard';
import { NoMarginSubtitleText } from '../../components/core/Text';

type DashboardSidebarProps = {
  tab: DashboardTab,
  onClick: (tab: DashboardTab) => void,
};

type TabItemProps = {
  active: boolean,
  onClick: (tab: DashboardTab) => void,
};

const Content = styled.div`
  position: absolute;
  width: 300px;
  top: 100px;
  left: 30px;
  bottom: 30px;
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const InnerContent = styled.div`
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
  flex: 1;
`;

const DashboardText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  font-weight: bold;
  margin: 4px 15px;
`;

const TabItem = styled.div<TabItemProps>`
  background-color: ${({ theme, active }) => (active ? theme.colors.background : theme.colors.white)};
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
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
          onClick={() => onClick(DashboardTab.GAME_HISTORY)}
        >
          <NoMarginSubtitleText>Game History (soon!)</NoMarginSubtitleText>
        </TabItem>
        <TabItem
          active={tab === DashboardTab.SUGGEST_FEATURE}
          onClick={() => onClick(DashboardTab.SUGGEST_FEATURE)}
        >
          <NoMarginSubtitleText>Suggest a Feature</NoMarginSubtitleText>
        </TabItem>
      </InnerContent>
    </Content>
  );
}

export default DashboardSidebar;
