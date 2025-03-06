'use client';

import * as React from 'react';
import { atom, useAtom } from 'jotai';
import type { ToastProps, ToastActionElement } from '@/components/ui/toast';

interface ToasterToast extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}

type Toast = Omit<ToasterToast, 'id'>;

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// Атом для хранения тостов
const toastsAtom = atom<ToasterToast[]>([]);

// Генерация ID
let count = 0;
const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

// Действия
type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

// Редюсер
const reducer = (state: ToasterToast[], action: Action): ToasterToast[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [action.toast, ...state].slice(0, TOAST_LIMIT);

    case 'UPDATE_TOAST':
      return state.map((toast) =>
        toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
      );

    case 'DISMISS_TOAST':
      const { toastId } = action; 
      if (toastId) {
        addToRemoveQue(toastId);
      } else {
        state.forEach((toast) => addToRemoveQue(toast.id));
      }
      return state.map((toast) =>
        toast.id === toastId || toastId === undefined ? { ...toast, open: false } : toast
      );

    case 'REMOVE_TOAST':
      return action.toastId === undefined
        ? []
        : state.filter((toast) => toast.id !== action.toastId);

    default:
      return state;
  }
};

// Атом с dispatch
const dispatchAtom = atom(null, (get, set, action: Action) => {
  set(toastsAtom, (prev) => reducer(prev, action));
});

// Утилита для удаления тостов с задержкой
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const addToRemoveQue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    const [, setDispatch] = useAtom(dispatchAtom);
    setDispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Хук для работы с тостами
 */
export function useToast() {
  const [toasts] = useAtom(toastsAtom);
  const [, dispatch] = useAtom(dispatchAtom);

  const toastFn = React.useCallback(
    ({ ...props }: Toast) => {
      const id = genId();
      const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
      dispatch({
        type: 'ADD_TOAST',
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => !open && dismiss(),
        },
      });
      return {
        id,
        dismiss,
        update: (props: Partial<ToasterToast>) =>
          dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } }),
      };
    },
    [dispatch]
  );

  return {
    toasts,
    toast: toastFn,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

// Функция для создания тостов вне хука
export const toast = (props: Toast) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};