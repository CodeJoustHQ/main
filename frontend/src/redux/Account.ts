import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase';

const initialState = null as firebase.User | null;

const accountSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<firebase.User | null>) {
      return action.payload;
    },
  },
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;
