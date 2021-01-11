import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NotificationBox = styled.div`
  position: absolute;
  bottom: 25px;
  left: 25px;
  padding: 25px;
  max-width: 20vw;
  font-size: ${({ theme }) => theme.fontSize.mediumLarge};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  background: linear-gradient(${({ theme }) => theme.colors.white}, ${({ theme }) => theme.colors.lightBlue});
  box-shadow: ${({ theme }) => theme.colors.lightGray} 0px 8px 24px;
  border-radius: 5px;
`;

type NotificationProps = {
  
};

// This function refreshes the width of Monaco editor upon change in container size
function NotificationContainer(props: NotificationProps) {

  return (
    <NotificationBox>
      Test.
    </NotificationBox>
  );
}

export default NotificationContainer;
