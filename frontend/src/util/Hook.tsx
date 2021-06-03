import { useState, useEffect, RefObject } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Player, Submission } from '../api/Game';
import { AppDispatch, RootState } from '../redux/Store';
import { FirebaseUserType } from '../redux/Account';
import { Problem } from '../api/Problem';

export const useBestSubmission = (player?: Player) => {
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
        if (player.submissions[i].numCorrect === player.submissions[i].numTestCases &&
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

export default useGetScore;

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

  if (!time && player && player.submissions.length > 0) {
    time = player.submissions[player.submissions.length - 1].startTime;
  }

  return time;
};

export const useProblemEditable = (user: FirebaseUserType | null, problem: Problem | null) => {
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!user || !problem || user.uid !== problem.owner.uid) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [user, problem]);

  return editable;
};

export const useClickOutside = (ref: RefObject<HTMLDivElement>, closeFunction: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current!.contains(e.target as Node)) {
        closeFunction();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, closeFunction]);
};

// Custom Redux Hooks with our store's types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;