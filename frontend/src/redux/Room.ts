import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../api/Room';

const initialState = null as Room | null;

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
});

export const { exampleAction, exampleActionWithPayload } = roomSlice.actions;
export default roomSlice.reducer;
