import React from 'react';
import styled from 'styled-components';

const NumberContainer = styled.div`
  display: inline-block;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  padding: 0.5rem 1rem;
  margin: 0 1rem 0 0;
  font-size: ${({ theme }) => theme.fontSize.xxLarge};
  font-weight: 700;
  border-radius: 0.5rem;
`;

type IdProps = {
  id: string,
};

function IdContainer(props: IdProps) {
  const { id } = props;

  return (
    <div>
      {
        id.split('').map((c, index) => {
          if (id.length - 1 === index) {
            return <NumberContainer style={{ margin: 0 }}>{c}</NumberContainer>;
          }
          return <NumberContainer>{c}</NumberContainer>;
        })
      }
    </div>
  );
}

export default IdContainer;
