import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRoom, Room } from '../api/Room';

const initialState = null as Room | null;

// Create an async action that fetches the room from the backend
export const fetchRoom = createAsyncThunk<Room, string>(
  'rooms/fetch',
  async (roomId, thunkApi) => getRoom(roomId)
    .then((res) => res)
    .catch((err) => thunkApi.rejectWithValue(err)),
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
    builder.addCase(fetchRoom.fulfilled, (state, action) => action.payload);
  },
});

export const { setRoom } = roomSlice.actions;
export default roomSlice.reducer;
