import React from 'react';
import styled from 'styled-components';
import { NoMarginSubtitleText } from './Text';

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
  
  width: 150px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  
  z-index: 2;
`;

const DropdownItemContainer = styled.div<DropdownItemContainerProps>`
  background-color: ${({ theme, active }) => (active ? theme.colors.background : theme.colors.white)};
  border-radius: 6px;
  padding: 8px;
  cursor: ${({ active }) => (active ? 'default' : 'pointer')};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

type DropdownItemContainerProps = {
  active: boolean,
};

type DropdownItem = {
  title: string,
  action: () => void,
  active: boolean,
};

type DropdownProps = {
  items: DropdownItem[],
};

function Dropdown(props: DropdownProps) {
  const { items } = props;

  return (
    <Content>
      {items.map((item) => (
        <DropdownItemContainer onClick={item.action} active={item.active}>
          <NoMarginSubtitleText>{item.title}</NoMarginSubtitleText>
        </DropdownItemContainer>
      ))}
    </Content>
  );
}

export default Dropdown;
