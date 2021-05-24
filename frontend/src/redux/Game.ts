import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, getGame } from '../api/Game';

const initialState = null as Game | null;

export const fetchGame = createAsyncThunk<Game, string>(
  'games/fetch',
  async (roomId, thunkApi) => getGame(roomId)
    .then((res) => res)
    .catch((err) => thunkApi.rejectWithValue(err)),
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame(state, action: PayloadAction<Game | null>) {
      // State is set to the returned value
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGame.fulfilled, (state,
      action) => action.payload);
  },
});

export const { setGame } = gameSlice.actions;
export default gameSlice.reducer;
