import styled from 'styled-components';

export const Image = styled.img`
  width: 80%;
  
  @media(max-width: 1450px) {
    width: 90%;
  }
  
  @media(max-width: 1000px) {
    width: 70%;
    margin: 20px 0;
  }
  
  @media(max-width: 600px) {
    width: 90%;
  }
`;

export const ShadowImage = styled(Image)`
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
`;
