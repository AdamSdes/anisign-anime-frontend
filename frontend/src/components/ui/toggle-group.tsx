"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { mergeClass } from "@/lib/utils/mergeClass";
import { toggleVariants } from "./toggle";

// Контекст для передачи вариантов стилей в ToggleGroup
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

// Базовые пропсы для ToggleGroup из Radix UI без ref
type ToggleGroupBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  "ref"
>;

// Дополнительные пропсы для стилизации через VariantProps
type ToggleGroupVariantProps = VariantProps<typeof toggleVariants>;

// Пропсы для ToggleGroup с типом single
interface ToggleGroupSingleProps extends ToggleGroupBaseProps, ToggleGroupVariantProps {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

// Пропсы для ToggleGroup с типом multiple
interface ToggleGroupMultipleProps extends ToggleGroupBaseProps, ToggleGroupVariantProps {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

// Общие пропсы для ToggleGroup
type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

/**
 * Компонент группы переключателей
 * @param props Пропсы группы переключателей
 */
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={mergeClass("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

// Пропсы элемента группы переключателей
interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {
  value: string; 
}

/**
 * Элемент группы переключателей
 * @param props Пропсы элемента переключателя
 */
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant, size, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      value={value}
      className={mergeClass(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;