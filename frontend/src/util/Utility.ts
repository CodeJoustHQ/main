import React from 'react';
import { User } from '../api/User';
import { removeUser } from '../api/Room';
import { disconnect } from '../api/Socket';
import { errorHandler } from '../api/Error';
import { setRoom } from '../redux/Room';
import { setCurrentUser } from '../redux/User';
import { setGame } from '../redux/Game';
import { AppDispatch } from '../redux/Store';

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
