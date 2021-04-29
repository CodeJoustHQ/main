import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRoom, Room } from '../api/Room';
import { setLoading, setError } from './Status';

const initialState = null as Room | null;

// Create an async action that fetches the room from the backend
const fetchRoom = createAsyncThunk<Room | null, string>(
  'rooms/fetch',
  async (roomId, thunkApi) => {
    thunkApi.dispatch(setLoading(true));

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
    exampleAction(state) {
      if (state) {
        // Update state's roomId parameter
        state!.roomId = '012345';
      }
    },
    exampleActionWithPayload(state, action: PayloadAction<Room>) {
      // State is set to the returned value
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoom.fulfilled, (_, action) => {
      // When the async fetchRoom action is fulfilled, set room state to its return object
      return action.payload;
    });
  },
});

export const { exampleAction, exampleActionWithPayload } = roomSlice.actions;
export default roomSlice.reducer;
