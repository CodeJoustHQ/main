import React, { useRef } from 'react';
import styled from 'styled-components';
import { useClickOutside } from '../../util/Hook';
import { GrayTextButton } from './Button';

type ContentProps = {
  show: boolean,
  fullScreen: boolean,
};

const Content = styled.div<ContentProps>`
  position: fixed;
  
  top: ${({ fullScreen }) => (fullScreen ? '10%' : '40%')};
  height: ${({ fullScreen }) => (fullScreen ? '80%' : '150px')};
  left: ${({ fullScreen }) => (fullScreen ? '20%' : '30%')};
  width: ${({ fullScreen }) => (fullScreen ? '60%' : '40%')};  
  min-height: 150px;

  z-index: ${({ show }) => (show ? 4 : -2)};
  background: ${({ theme }) => theme.colors.white};
  overflow-y: scroll;
  
  border-radius: 10px;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, .24);
  
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 300ms;
`;

const ModalContent = styled.div`
  position: relative;
  padding: 10px 30px;
  margin: 30px 0;
`;

const CloseButton = styled(GrayTextButton)`
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 1;
`;

type ModalProps = {
  show: boolean,
  children: React.ReactNode,
  onExit: () => void,
  fullScreen: boolean,
};

function Modal(props: ModalProps) {
  const {
    show, children, onExit, fullScreen,
  } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => onExit());

  return (
    <Content show={show} ref={modalRef} fullScreen={fullScreen}>
      <CloseButton onClick={onExit}>Close</CloseButton>
      <ModalContent>
        {children}
      </ModalContent>
    </Content>
  );
}

export default Modal;
