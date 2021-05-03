import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRoom, Room } from '../api/Room';
import { setLoading, setError } from './Status';

const initialState = null as Room | null;

// Create an async action that fetches the room from the backend
export const fetchRoom = createAsyncThunk<Room | null, string>(
  'rooms/fetch',
  async (roomId, thunkApi) => {
    thunkApi.dispatch(setLoading(true));
    thunkApi.dispatch(setError(''));

    return getRoom(roomId)
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

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<Room | null>) {
      // State is set to the returned value
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoom.fulfilled, (state, action) => {
      // When the async fetchRoom action is fulfilled, set room state to its return object
      return action.payload;
    });
  },
});

export const { setRoom } = roomSlice.actions;
export default roomSlice.reducer;
