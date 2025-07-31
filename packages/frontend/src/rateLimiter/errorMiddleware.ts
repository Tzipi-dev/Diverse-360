import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { showError } from './errorModalSlice';
interface RejectedPayload {
  status: number;
  data?: {
    message?: string;
  };
}
export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as RejectedPayload;
    if (payload.status === 429) {
      const message = payload.data?.message || 'חרגת מהמכסה. נסה שוב מאוחר יותר.';
      store.dispatch(showError(message));
    }
  }
  return next(action);
};