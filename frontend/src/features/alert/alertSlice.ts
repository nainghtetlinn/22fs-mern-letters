import { createSlice } from '@reduxjs/toolkit';

type stateTypes = {
  type: 'error' | 'info' | 'success' | 'warning';
  msg: string;
  open: boolean;
};
const initialState: stateTypes = { type: 'info', msg: '', open: false };

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.msg = action.payload.msg;
      state.type = action.payload.type;
      state.open = true;
    },
    closeMessage: state => {
      state.msg = '';
      state.open = false;
    },
  },
});

export const { showMessage, closeMessage } = alertSlice.actions;
export default alertSlice.reducer;
