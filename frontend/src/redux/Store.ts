import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './Room';
import gameReducer from './Game';
import userReducer from './User';
import accountReducer from './Account';
import problemReducer from './Problem';

const store = configureStore({
  reducer: {
    room: roomReducer,
    game: gameReducer,
    currentUser: userReducer,
    account: accountReducer,
    problem: problemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
