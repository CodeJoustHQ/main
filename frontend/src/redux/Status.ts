import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StatusState = {
  loading: boolean,
  error: string,
};

const initialState: StatusState = {
  loading: false,
  error: '',
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = statusSlice.actions;
export default statusSlice.reducer;
