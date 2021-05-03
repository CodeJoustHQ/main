import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setLoading, setError } from './Status';
import { Game, getGame } from '../api/Game';

const initialState = null as Game | null;

export const fetchGame = createAsyncThunk<Game | null, string>(
  'games/fetch',
  async (roomId, thunkApi) => {
    thunkApi.dispatch(setLoading(true));
    thunkApi.dispatch(setError(''));

    return getGame(roomId)
      .then((res) => {
        thunkApi.dispatch(setLoading(false));
        return res;
      })
      .catch((err) => {
        thunkApi.dispatch(setLoading(false));
        thunkApi.dispatch(setError(err.message));
        return null;
      });
  },
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame(state, action: PayloadAction<Game>) {
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
