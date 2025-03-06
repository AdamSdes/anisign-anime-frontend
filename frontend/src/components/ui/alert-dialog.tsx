'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { mergeClass } from '@/lib/utils/mergeClass';
import { buttonVariants } from './button';

// Корневой компонент AlertDialog
export const AlertDialogComponent = AlertDialogPrimitive.Root;

// Триггер для открытия диалога
export const AlertDialogTriggerComponent = AlertDialogPrimitive.Trigger;

// Портал для размещения модального окна
export const AlertDialogPortalComponent = AlertDialogPrimitive.Portal;

// Оверлей для модального окна
export const AlertDialogOverlayComponent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={mergeClass(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
AlertDialogOverlayComponent.displayName = 'AlertDialogOverlay';

// Контент модального окна
export const AlertDialogContentComponent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortalComponent>
    <AlertDialogOverlayComponent />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={mergeClass(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortalComponent>
));
AlertDialogContentComponent.displayName = 'AlertDialogContent';

// Заголовок модального окна
export const AlertDialogHeaderComponent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={mergeClass('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeaderComponent.displayName = 'AlertDialogHeader';

// Футер модального окна
export const AlertDialogFooterComponent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={mergeClass('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
AlertDialogFooterComponent.displayName = 'AlertDialogFooter';

// Заголовок текста в модальном окне
export const AlertDialogTitleComponent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={mergeClass('text-lg font-semibold', className)}
    {...props}
  />
));
AlertDialogTitleComponent.displayName = 'AlertDialogTitle';

// Описание в модальном окне
export const AlertDialogDescriptionComponent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={mergeClass('text-sm text-muted-foreground', className)}
    {...props}
  />
));
AlertDialogDescriptionComponent.displayName = 'AlertDialogDescription';

// Кнопка действия в модальном окне
export const AlertDialogActionComponent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={mergeClass(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogActionComponent.displayName = 'AlertDialogAction';

// Кнопка отмены в модальном окне
export const AlertDialogCancelComponent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={mergeClass(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
));
AlertDialogCancelComponent.displayName = 'AlertDialogCancel';


