import { useState, useEffect } from 'react';
import { Player, Submission } from '../api/Game';

// eslint-disable-next-line import/prefer-default-export
export const useBestSubmission = (player?: Player) => {
  const [bestSubmission, setBestSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (player) {
      let newBestSubmission: Submission | null = bestSubmission;

      // Find best submission
      player.submissions.forEach((submission) => {
        if (!newBestSubmission || submission.numCorrect > newBestSubmission.numCorrect) {
          newBestSubmission = submission;
        }
      });

      setBestSubmission(newBestSubmission);
    }
  }, [player, setBestSubmission]);

  return bestSubmission;
};
