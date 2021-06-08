import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, getAccount } from '../api/Account';
import { Game, getGame } from '../api/Game';
import { RootState } from './Store';
import { fetchGame } from './Game';

/**
 * Due to serialization issues, we can't directly store the
 * firebase.User object in Redux (instead we store a toJson
 * object version). This means we'll have to manually specify
 * the type and copy any relevant fields from the docs below:
 * https://firebase.google.com/docs/reference/js/firebase.User
 */
export type FirebaseUserType = {
  email: string,
  uid: string,
}

export type AccountType = {
  firebaseUser: FirebaseUserType | null,
  account: Account | null,
  token: string | null,
};

export const fetchAccount = createAsyncThunk<Account | null>(
  'accounts/fetch',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const { firebaseUser, token } = state.account;

    if (!firebaseUser || !token) {
      return null;
    }

    return getAccount(firebaseUser.uid, token)
      .then((res) => res)
      .catch((err) => thunkApi.rejectWithValue(err));
  },
);

const initialState = { firebaseUser: null, account: null, token: null } as AccountType;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setFirebaseUser(state, action: PayloadAction<FirebaseUserType | null>) {
      state.firebaseUser = action.payload;
    },
    setAccount(state, action: PayloadAction<Account | null>) {
      state.account = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.account = action.payload;
    });
  },
});

export const { setAccount, setFirebaseUser, setToken } = accountSlice.actions;
export default accountSlice.reducer;
