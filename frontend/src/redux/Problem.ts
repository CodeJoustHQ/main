import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Problem } from '../api/Problem';

export type ProblemSliceType = {
  verifiedProblems: Problem[],
};

const initialState = { verifiedProblems: [] } as ProblemSliceType;

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    setVerifiedProblems(state, action: PayloadAction<Problem[]>) {
      state.verifiedProblems = action.payload;
    },
  },
});

export const { setVerifiedProblems } = problemSlice.actions;
export default problemSlice.reducer;
