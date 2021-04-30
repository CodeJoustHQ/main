import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './Room';
import statusReducer from './Status';
import userReducer from './User';

const store = configureStore({
  reducer: {
    room: roomReducer,
    status: statusReducer,
    currentUser: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;

export default store;
