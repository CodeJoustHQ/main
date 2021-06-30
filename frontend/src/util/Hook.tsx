import {
  useState, useEffect, RefObject, useCallback,
} from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Player, Submission } from '../api/Game';
import { AppDispatch, RootState } from '../redux/Store';
import { FirebaseUserType } from '../redux/Account';
import { Problem } from '../api/Problem';
import { Coordinate } from '../components/special/FloatingCircle';
import app from '../api/Firebase';

// Finds the first best submission by a player (for a specific problem, if specified)
export const useBestSubmission = (player?: Player | null, problemIndex?: number) => {
  const [bestSubmission, setBestSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (player) {
      let newBestSubmission: Submission | null = null;

      // If problemIndex is specified, find best submission only for that problem
      const submissions = (problemIndex !== undefined)
        ? player.submissions.filter((s) => s.problemIndex === problemIndex) : player.submissions;

      // Find best submission
      submissions.forEach((submission) => {
        if (!newBestSubmission || submission.numCorrect > newBestSubmission.numCorrect) {
          newBestSubmission = submission;
        }
      });

      setBestSubmission(newBestSubmission);
    }
  }, [player, setBestSubmission, problemIndex]);

  return bestSubmission;
};

// Calculates the overall score of a player (number solved)
export const useGetScore = (player?: Player): number | null => {
  const counted = new Set<number>();
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (player) {
      for (let i = 0; i < player.submissions.length; i += 1) {
        if (player.submissions[i].numCorrect === player.submissions[i].numTestCases
          && !counted.has(player.submissions[i].problemIndex)) {
          counted.add(player.submissions[i].problemIndex);
        }
      }

      setScore(counted.size);
    }
  }, [player, setScore, counted]);

  if (player == null || player.submissions.length === 0) {
    return null;
  }
  return score;
};

// Calculates the time taken for the latest 100% correct solution for a problem
export const useGetSubmissionTime = (player?: Player) => {
  const counted = new Set<number>();
  const [time, setTime] = useState<string>();

  useEffect(() => {
    if (player) {
      for (let i = 0; i < player.submissions.length; i += 1) {
        if (player.submissions[i].numCorrect === player.submissions[i].numTestCases
          && !counted.has(player.submissions[i].problemIndex)) {
          counted.add(player.submissions[i].problemIndex);
          setTime(player.submissions[i].startTime);
        }
      }
    }
  }, [player, counted]);

  if (!time && player && player.submissions.length > 0) {
    setTime(player.submissions[player.submissions.length - 1].startTime);
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

export const useMousePosition = (pagePosition: boolean = false) => {
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: 0, y: 0 });

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    setMousePosition(pagePosition ? { x: e.pageX, y: e.pageY } : { x: e.clientX, y: e.clientY });
  }, [setMousePosition, pagePosition]);

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler);
    return () => window.removeEventListener('mousemove', mouseMoveHandler);
  }, [mouseMoveHandler]);

  return mousePosition;
};

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
