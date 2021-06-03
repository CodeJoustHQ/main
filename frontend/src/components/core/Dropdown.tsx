import React from 'react';
import styled from 'styled-components';
import { NoMarginSubtitleText } from './Text';
import { DivLink } from './Link';

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

const DropdownItemLinkContainer = styled.div<DropdownItemContainerProps>`
  background-color: ${({ theme, active }) => (active ? theme.colors.background : theme.colors.white)};
  border-radius: 6px;
  cursor: ${({ active }) => (active ? 'default' : 'pointer')};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const DropdownItemButtonContainer = styled(DropdownItemLinkContainer)`
  padding: 8px;
`;

const InnerLinkContent = styled.div`
  padding: 8px;
`;

type DropdownItemContainerProps = {
  active: boolean,
};

// Specify either an action or a link
type DropdownItem = {
  title: string,
  action?: () => void,
  link?: string
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
        <>
          {item.action ? (
            <DropdownItemButtonContainer onClick={item.action} active={item.active}>
              <NoMarginSubtitleText>{item.title}</NoMarginSubtitleText>
            </DropdownItemButtonContainer>
          ) : (
            <DropdownItemLinkContainer active={item.active}>
              <DivLink to={item.link || '/'}>
                <InnerLinkContent>
                  <NoMarginSubtitleText>{item.title}</NoMarginSubtitleText>
                </InnerLinkContent>
              </DivLink>
            </DropdownItemLinkContainer>
          )}
        </>
      ))}
    </Content>
  );
}

export default Dropdown;
