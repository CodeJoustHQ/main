import styled from 'styled-components';

export const SliderContainer = styled.div`
  width: 100%;
  margin: 0.5rem 0;
`;

type SliderRange = {
  value: number,
};

export const Slider = styled.input.attrs((props: SliderRange) => ({
  type: 'range',
  class: 'slider',
  value: props.value,
}))<SliderRange>`
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #B7D4FF;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 10px;
    background: linear-gradient(180deg, #133ED7 0%, #90BDFF 100%);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 10px;
    background: linear-gradient(180deg, #133ED7 0%, #90BDFF 100%);
    cursor: pointer;
  }
`;
