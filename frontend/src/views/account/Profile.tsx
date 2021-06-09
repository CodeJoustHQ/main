import React from 'react';
import styled from 'styled-components';
import { Text, MediumText, LargeText } from '../../components/core/Text';

const Content = styled.div`
  text-align: center;
`;

function DashboardPage() {
  return (
    <Content>
      <LargeText>My Profile</LargeText>
      <MediumText>Page coming soon!</MediumText>
      <Text>Update your info, set a default display name, and more.</Text>
    </Content>
  );
}

export default DashboardPage;
