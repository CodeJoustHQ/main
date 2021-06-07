import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Problem } from '../api/Problem';

export type ProblemSliceType = {
  verifiedProblems: Problem[],
  newProblem: Problem | null,
};

const initialState = { verifiedProblems: [], newProblem: null } as ProblemSliceType;

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    setVerifiedProblems(state, action: PayloadAction<Problem[]>) {
      state.verifiedProblems = action.payload;
    },
    setNewProblem(state, action: PayloadAction<Problem | null>) {
      state.newProblem = action.payload;
    },
  },
});

export const { setVerifiedProblems, setNewProblem } = problemSlice.actions;
export default problemSlice.reducer;
