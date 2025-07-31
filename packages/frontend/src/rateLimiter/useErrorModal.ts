import { useDispatch } from 'react-redux';
import { showError } from './errorModalSlice';
export const useErrorModal = () => {
  const dispatch = useDispatch();
  return (message: string) => {
    dispatch(showError(message));
  };
};