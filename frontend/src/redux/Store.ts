import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './Room';

export default configureStore({
  reducer: {
    room: roomReducer,
  },
});
