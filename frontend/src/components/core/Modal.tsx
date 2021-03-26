import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { GrayTextButton } from './Button';

const Content = styled.div<ContentProps>`
  position: fixed;
  top: 10%;
  bottom: 10%;
  left: 20%;
  right: 20%;
  z-index: ${({ show }) => (show ? 2 : -2)};
  background: ${({ theme }) => theme.colors.white};
  
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
  
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 300ms ease-in-out;
`;

const ModalContent = styled.div`
  position: relative;
  padding: 10px 30px 30px 30px;
  margin-top: 30px;
`;

const CloseButton = styled(GrayTextButton)`
  position: absolute;
  top: 8px;
  right: 12px;
`;

type ContentProps = {
  show: boolean,
};

type ResultsTableProps = {
  show: boolean,
  children: React.ReactNode,
  onExit: () => void,
};

function Modal(props: ResultsTableProps) {
  const { show, children, onExit } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current!.contains(e.target as Node)) {
        onExit();
      }
    };

    // Bind the onClick event listener (and remove it on finish)
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modalRef]);

  return (
    <Content show={show} ref={modalRef}>
      <CloseButton onClick={onExit}>Close</CloseButton>
      <ModalContent>
        {children}
      </ModalContent>
    </Content>
  );
}

export default Modal;
