import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../api/Account';

/**
 * Due to serialization issues, we can't directly store the
 * firebase.User object in Redux (instead we store a toJson
 * object version). This means we'll have to manually specify
 * the type and copy any relevant fields from the docs below:
 * https://firebase.google.com/docs/reference/js/firebase.User
 */
export type FirebaseUserType = {
  displayName: string,
  email: string,
  emailVerified: boolean,
  refreshToken: string,
  uid: string,
}

export type AccountType = {
  firebaseUser: FirebaseUserType | null,
  account: Account | null,
  token: string | null,
};

const initialState = { firebaseUser: null, token: null } as AccountType;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setFirebaseUser(state, action: PayloadAction<FirebaseUserType | null>) {
      state.firebaseUser = action.payload;
    },
    setAccount(state, action: PayloadAction<FirebaseUserType | null>) {
      state.firebaseUser = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
});

export const { setAccount, setFirebaseUser, setToken } = accountSlice.actions;
export default accountSlice.reducer;
