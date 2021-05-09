import { useState, useEffect } from 'react';
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
}

// Custom Redux Hooks with our store's types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
