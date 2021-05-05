import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = null as Object | null;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<Object | null>) {
      return action.payload;
    },
  },
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;
