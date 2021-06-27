import React from 'react';
import { User } from '../api/User';
import { removeUser } from '../api/Room';
import { disconnect } from '../api/Socket';
import { errorHandler } from '../api/Error';
import { setRoom } from '../redux/Room';
import { setCurrentUser } from '../redux/User';
import { setGame } from '../redux/Game';
import { AppDispatch } from '../redux/Store';
import { Problem, SelectableProblem } from '../api/Problem';
import { Player, Submission } from '../api/Game';

// Require validator for identifiers as no types are provided.
const validateIdentifier = require('valid-identifier');

/**
 * Check whether all keys in param exist in location.state
 */
export const checkLocationState = (location: any, ...params: string[]) => {
  if (!(location && location.state)) {
    return false;
  }

  let valid = true;
  params.forEach((param) => {
    valid = valid && (param in location.state);
  });

  return valid;
};

/**
 * The roomId is valid if it is non-empty and has exactly six
 * numeric characters.
 */
export const isValidRoomId = (roomIdParam: string): boolean => (roomIdParam.length === 6) && /^\d+$/.test(roomIdParam);

/**
 * Generate a random id used for various purposes, including
 * the frontend Draggable test cases on the edit problem page.
 */
export const generateRandomId = (): string => Math.random().toString(36);

/**
 * Remove a user or player from the given lobby or game
 */
export const leaveRoom = (dispatch: AppDispatch, history: any,
  roomId: string, user: User | null) => {
  // eslint-disable-next-line no-alert
  if (window.confirm('Are you sure you want to leave the room?')) {
    if (user && user.userId) {
      removeUser(roomId, {
        initiator: user,
        userToDelete: user,
      });
      disconnect();
    }

    // Clear redux states
    dispatch(setRoom(null));
    dispatch(setGame(null));
    dispatch(setCurrentUser(null));

    history.replace('/game/join', {
      error: errorHandler('You left the room.'),
    });
  }
};

// Return true iff the character is a letter.
const isLetter = (character: string) => {
  if (character.length !== 1) {
    return false;
  }

  // Character is a letter iff the upper case does not equal lower case.
  return character.toUpperCase() !== character.toLowerCase();
};

// Return true iff the variable is a valid identifier, and starts with a letter.
export const validIdentifier = (identifier: string) => validateIdentifier(identifier)
  && isLetter(identifier.charAt(0));

export const onEnterAction = (action: () => void, event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    action();
  }
};

export const getAuthHttpHeader = (token: string) => ({
  headers: {
    Authorization: token,
  },
});

export const problemMatchesFilterText = (problem: Problem | SelectableProblem,
  filterText: string): boolean => {
  const texts = filterText.toLowerCase().split(',');

  // Filter by name, difficulty, and tags (multiple queries separated by commas)
  for (let i = 0; i < texts.length; i += 1) {
    const text = texts[i].trim();
    if (!problem.name.toLowerCase().includes(text)
      && !problem.difficulty.toLowerCase().includes(text)
      && !problem.problemTags.some((tag) => tag.name.toLowerCase().includes(text))) {
      return false;
    }
  }

  return true;
};

// Displays the percentage correct of a specific submission
export const getScore = (bestSubmission: Submission | null) => {
  if (!bestSubmission) {
    return '0';
  }

  const percent = Math.round((bestSubmission.numCorrect / bestSubmission.numTestCases) * 100);
  return `${percent}%`;
};

// Displays the time taken for a specific submission
export const getSubmissionTime = (bestSubmission: Submission | null,
  gameStartTime: string | null) => {
  if (!bestSubmission || !gameStartTime) {
    return 'N/A';
  }

  // Calculate time from start of game till best submission
  const startTime = new Date(gameStartTime).getTime();
  const diffMilliseconds = new Date(bestSubmission.startTime).getTime() - startTime;
  const diffMinutes = Math.floor(diffMilliseconds / (60 * 1000));

  return ` ${diffMinutes} min`;
};

// Gets the number of submissions for a specific player and problem
export const getSubmissionCount = (player: Player | null, problemIndex?: number) => {
  const submissions = (problemIndex !== undefined)
    ? player?.submissions.filter((s) => s.problemIndex === problemIndex) : player?.submissions;

  return submissions?.length || '0';
};
