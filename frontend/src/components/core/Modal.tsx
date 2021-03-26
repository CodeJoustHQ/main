import React from 'react';
import styled from 'styled-components';

const Content = styled.div<ContentProps>`
  position: fixed;
  top: 20%;
  bottom: 20%;
  left: 20%;
  right: 20%;
  
  opacity: ${({ show }) => (show ? 1 : 0)};
  //transform: translateX(-100px);
  transition: all 500ms ease-in-out;
`;

const ModalContent = styled.div`
  position: relative;
  padding: 30px;
`;

type ContentProps = {
  show: boolean,
};

type ResultsTableProps = {
  show: boolean,
  children: React.ReactNode,
};

function Modal(props: ResultsTableProps) {
  const { show, children } = props;

  return (
    <Content show={show}>
      <ModalContent>
        {children}
      </ModalContent>
    </Content>
  );
}

export default Modal;
