import React from 'react';
import styled from 'styled-components';
import { Text, MediumText, LargeText } from '../../components/core/Text';
import { PrimaryButtonLink } from '../../components/core/Link';
import { useAppSelector } from '../../util/Hook';

const Content = styled.div`
  text-align: center;
`;

function ProfilePage() {
  const { firebaseUser } = useAppSelector((state) => state.account);

  return (
    <Content>
      <LargeText>My Profile</LargeText>
      <MediumText>Page coming soon!</MediumText>
      <Text>Update your info, set a default display name, and more.</Text>
      {firebaseUser ? (
        <Text>
          Email:
          {' '}
          {firebaseUser.email}
        </Text>
      ) : null}

      <PrimaryButtonLink to="/">To Dashboard</PrimaryButtonLink>
    </Content>
  );
}

export default ProfilePage;
