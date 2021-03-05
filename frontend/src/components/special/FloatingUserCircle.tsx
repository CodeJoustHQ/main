import styled from 'styled-components';

type PositionProps = {
  top: number,
}

const FloatingUserCircle = styled.div<PositionProps>`
  position: absolute;
  top: ${(props) => (props.top ? '20px' : '0px')};
  left: 20px;
  width: 100px;
  height: 100px;
  background: linear-gradient(207.68deg, #14D633 10.68%, #DAFFB5 91.96%);
  border-radius: 50%;
  transition: left 0.25s ease;
  
  &:hover {
    left: 30px;
  }
`;

export default FloatingUserCircle;
