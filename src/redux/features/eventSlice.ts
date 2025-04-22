import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventState } from '../types';

const initialState: EventState = {
  invited: [],
  invitedCount: 0,
  linkedCount: 0,
  linkedAll: false,
  invitedAll: false,
  linkedRecords: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    invitePerson: (state, action: PayloadAction<Array<any>>) => {
      state.invited = action.payload;
      state.invitedAll = false;
    },
    inviteAll: (
      state,
      action: PayloadAction<{
        invited: Array<any>;
        length: number;
        isAll: boolean;
      }>,
    ) => {
      state.invited = action.payload.invited;
      state.invitedCount = action.payload.length;
      state.invitedAll = action.payload.isAll;
    },
    linkAll: (
      state,
      action: PayloadAction<{
        linked: Array<any>;
        length: number;
        isAll: boolean;
      }>,
    ) => {
      state.linkedRecords = action.payload.linked;
      state.linkedCount = action.payload.length;
      state.linkedAll = action.payload.isAll;
    },
    removeInvitedUser: (state, action) => {
      state.invited = state.invited.filter(user => user._id !== action.payload);
      state.invitedAll = false;
    },
    linkRecords: (state, action: PayloadAction<Array<any>>) => {
      state.linkedRecords = action.payload;
      state.linkedAll = false;
    },
    removelinkedRecords: (state, action) => {
      state.linkedRecords = state.linkedRecords.filter(
        record => record.id !== action.payload,
      );
      state.linkedAll = false;
    },
  },
});

export const {
  invitePerson,
  removeInvitedUser,
  linkRecords,
  removelinkedRecords,
  inviteAll,
  linkAll,
} = eventSlice.actions;
export default eventSlice.reducer;
