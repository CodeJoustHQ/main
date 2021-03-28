import { User } from '../api/User';
import { removeUser } from '../api/Room';
import { disconnect } from '../api/Socket';
import { errorHandler } from '../api/Error';

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
export const leaveRoom = (history: any, roomId: string, user: User | null) => {
  // eslint-disable-next-line no-alert
  if (window.confirm('Are you sure you want to leave the room?')) {
    if (user && user.userId) {
      removeUser(roomId, {
        initiator: user,
        userToDelete: user,
      });
      disconnect();
    }

    history.replace('/game/join', {
      error: errorHandler('You left the room.'),
    });
  }
};
