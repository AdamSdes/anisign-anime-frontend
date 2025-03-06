import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';

/**
 * Хук для диспетчера Redux
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Хук для селектора Redux
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;