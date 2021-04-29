import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './Room';
import statusReducer from './Status';

const rootReducer = configureStore({
  reducer: {
    room: roomReducer,
    status: statusReducer,
  },
});

export type RootState = ReturnType<typeof rootReducer.getState>;
export type AppDispatch = ReturnType<typeof rootReducer.dispatch>;

export default rootReducer;
