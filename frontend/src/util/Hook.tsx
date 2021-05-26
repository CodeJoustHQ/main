import { useState, useEffect, RefObject } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Player, Submission } from '../api/Game';
import { AppDispatch, RootState } from '../redux/Store';
import { FirebaseUserType } from '../redux/Account';
import { Problem } from '../api/Problem';
import app from '../api/Firebase';

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

export const useAuthCheck = (redirectAction: () => void, errorAction: (msg: string) => void) => {
  const { firebaseUser } = useAppSelector((state) => state.account);

  useEffect(() => {
    app.auth().getRedirectResult()
      .then(() => {
        if (firebaseUser) redirectAction();
      }).catch((err) => {
        if (err.message.includes('cookies')) {
          errorAction(`${err.message} Note: Google login does not currently support Chrome incognito windows.`);
        } else {
          errorAction(err.message);
        }
      });
  }, [firebaseUser, redirectAction, errorAction]);
};
