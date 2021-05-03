import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './Room';
import gameReducer from './Game';
import statusReducer from './Status';
import userReducer from './User';

const store = configureStore({
  reducer: {
    room: roomReducer,
    game: gameReducer,
    status: statusReducer,
    currentUser: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
