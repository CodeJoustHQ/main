import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Due to serialization issues, we can't directly store the
 * firebase.User object in Redux (instead we store a toJson
 * object version). This means we'll have to manually specify
 * the type and copy any relevant fields from the docs below:
 * https://firebase.google.com/docs/reference/js/firebase.User
 */
export type AccountType = {
  displayName: string,
  email: string,
  emailVerified: boolean,
  refreshToken: string,
  uid: string,
}

const initialState = null as AccountType | null;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<AccountType | null>) {
      return action.payload;
    },
  },
});

export const { setAccount } = accountSlice.actions;
export default accountSlice.reducer;
