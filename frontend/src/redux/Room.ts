import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRoom, Room } from '../api/Room';

const initialState = null as Room | null;

const fetchRoom = createAsyncThunk(
  'users/fetchByIdStatus',
  async (roomId, thunkAPI) => {
    const response = await getRoom(roomId);
    return response.data;
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
  extraReducers: {
    [fetchRoom.fulfilled]: (state, action) => {
      // Set state to be the payload
      return action.payload;
    },
  };
});

export const { exampleAction, exampleActionWithPayload } = roomSlice.actions;
export default roomSlice.reducer;
