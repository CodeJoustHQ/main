import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Due to serialization issues, we can't directly store the
 * firebase.User object in Redux (instead we store a toJson
 * object version). This means we'll have to manually specify
 * the type and copy any relevant fields from the docs below:
 * https://firebase.google.com/docs/reference/js/firebase.User
 */
export type UserType = {
  displayName: string,
  email: string,
  emailVerified: boolean,
  refreshToken: string,
  uid: string,
}

export type AccountType = {
  account: UserType | null,
  token: string | null,
};

const initialState = { account: null, token: null } as AccountType;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<UserType | null>) {
      state.account = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
});

export const { setAccount, setToken } = accountSlice.actions;
export default accountSlice.reducer;
