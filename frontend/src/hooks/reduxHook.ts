import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/redux/store';

/**
 * Типизированный хук для диспетчера Redux
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Типизированный хук для селекторов Redux
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;