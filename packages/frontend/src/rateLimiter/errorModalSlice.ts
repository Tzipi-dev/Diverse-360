import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface ErrorModalState {
  open: boolean;
  message: string;
}
const initialState: ErrorModalState = {
  open: false,
  message: '',
};
const errorModalSlice = createSlice({
  name: 'errorModal',
  initialState,
  reducers: {
    showError: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.message = action.payload;
    },
    hideError: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showError, hideError } = errorModalSlice.actions;
export default errorModalSlice.reducer;