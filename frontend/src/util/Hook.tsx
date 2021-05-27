import { useState, useEffect } from 'react';
import { Player, Submission, SubmissionType } from '../api/Game';

const useBestSubmission = (player?: Player) : Submission | null => {
  const [bestSubmission, setBestSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (player) {
      let newBestSubmission: Submission | null = null;

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

const useGetScore = (player?: Player) => {
  const counted = new Set<Number>();

  useEffect(() => {
    if (player) {
      for (let i = 0; i < player.submissions.length; i += 1) {
        if (player.submissions[i].submissionType === SubmissionType.Submit &&
          player.submissions[i].numCorrect === player.submissions[i].numTestCases &&
          !counted.has(player.submissions[i].problemIndex)) {
          counted.add(player.submissions[i].problemIndex);
        }
      }
    }
  }, [player]);

  if (player == null || player.submissions.length === 0) {
    return null;
  }

  return counted.size;
};

export const useGetSubmissionTime = (player?: Player) => {
  const counted = new Set<Number>();
  let time;

  useEffect(() => {
    if (player) {
      for (let i = 0; i < player.submissions.length; i += 1) {
        if (player.submissions[i].submissionType === SubmissionType.Submit &&
          player.submissions[i].numCorrect === player.submissions[i].numTestCases &&
          !counted.has(player.submissions[i].problemIndex)) {
          counted.add(player.submissions[i].problemIndex);
          time = player.submissions[i].startTime;
        }
      }
    }
  }, [player]);

  if (!time && player) {
    time = player.submissions[player.submissions.length - 1].startTime;
  }

  return time;
};

export default useGetScore;
export { useBestSubmission };
