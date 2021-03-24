import styled from "styled-components";

type HoverTooltipType = {
  x: number,
  y: number,
  visible: boolean,
}

export const HoverTooltip = styled.div.attrs((props: HoverTooltipType) => ({
  style: {
    display: `${props.visible ? 'block' : 'none'}`,
    transform: `translate(${props.x + 2}px, ${props.y + 2}px)`,
  },
}))<HoverTooltipType>`
  z-index: 3;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.medium};
  position: absolute;
  top: 0;
  left: 0;
`;

export const HoverContainer = styled.div`
  position: relative;
  padding: 0;
  display: inline-block;
`;

type HoverElementDisplay = {
  enabled: boolean,
}

export const HoverElement = styled.div.attrs((props: HoverElementDisplay) => ({
  style: {
    display: `${props.enabled ? 'none' : 'block'}`,
  },
}))<HoverElementDisplay>`
  position: absolute;
  z-index: 1;
`;
