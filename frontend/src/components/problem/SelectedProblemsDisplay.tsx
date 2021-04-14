import React from 'react';
import { SelectableProblem } from '../../api/Problem';

type SelectedProblemsDisplayProps = {
  problems: SelectableProblem[],
}

function SelectedProblemsDisplay(props: SelectedProblemsDisplayProps) {
  const { problems } = props;

  return (
    <div>
      content
    </div>
  );
}

export default SelectedProblemsDisplay;
