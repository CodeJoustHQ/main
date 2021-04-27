import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './Room';

const rootReducer = configureStore({
  reducer: {
    room: roomReducer,
  },
});

export type RootState = ReturnType<typeof rootReducer.getState>;
export type AppDispatch = ReturnType<typeof rootReducer.dispatch>;

export default rootReducer;
