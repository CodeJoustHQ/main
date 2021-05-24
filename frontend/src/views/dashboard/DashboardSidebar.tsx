import React from 'react';
import styled from 'styled-components';
import { DashboardTab } from './Dashboard';
import { NoMarginSubtitleText } from '../../components/core/Text';

type DashboardSidebarProps = {
  tab: DashboardTab,
};

type TabItemProps = {
  active: boolean,
};

const Content = styled.div`
  width: 300px;
  height: 800px;
  padding: 16px;
  text-align: left;
  
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.white};
`;

const TabItem = styled.div<TabItemProps>`
  background-color: ${({ theme, active }) => (active ? theme.colors.background : theme.colors.white)};
  border-radius: 6px;
  padding: 8px;
  
  cursor: pointer;
`;

function DashboardSidebar(props: DashboardSidebarProps) {
  const { tab } = props;

  return (
    <Content>
      <TabItem active={tab === DashboardTab.PROBLEMS}>
        <NoMarginSubtitleText>Problems</NoMarginSubtitleText>
      </TabItem>
      <TabItem active={tab === DashboardTab.GAME_HISTORY}>
        <NoMarginSubtitleText>Game History (soon!)</NoMarginSubtitleText>
      </TabItem>
      <TabItem active={tab === DashboardTab.SUGGEST_FEATURE}>
        <NoMarginSubtitleText>Suggest a Feature</NoMarginSubtitleText>
      </TabItem>
    </Content>
  );
}

export default DashboardSidebar;
