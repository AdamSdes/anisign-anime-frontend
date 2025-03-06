"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle, LucideIcon } from "lucide-react";
import { mergeClass } from "@/lib/utils/mergeClass";

/**
 * Базовый компонент выпадающего меню
 * @description Обёртка над Radix UI DropdownMenu.Root
 */
const DropdownMenu = DropdownMenuPrimitive.Root;

/**
 * Триггер для выпадающего меню
 * @description Обёртка над Radix UI DropdownMenu.Trigger
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/**
 * Группа элементов в выпадающем меню
 * @description Обёртка над Radix UI DropdownMenu.Group
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * Портал для рендеринга меню
 * @description Обёртка над Radix UI DropdownMenu.Portal
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * Подменю в выпадающем меню
 * @description Обёртка над Radix UI DropdownMenu.Sub
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * Группа радиокнопок в выпадающем меню
 * @description Обёртка над Radix UI DropdownMenu.RadioGroup
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Пропсы для триггера подменю
interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

/**
 * Триггер для подменю
 * @description Компонент для открытия подменю с иконкой ChevronRight
 * @param {DropdownMenuSubTriggerProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={mergeClass(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// Пропсы для контента подменю
interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {}

/**
 * Контент подменю
 * @description Контент для подменю с анимацией и стилями
 * @param {DropdownMenuSubContentProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={mergeClass(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

//  Пропсы для контента выпадающего меню
interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  sideOffset?: number;
}

/**
 * Контент выпадающего меню
 * @description Основной контейнер для элементов меню с порталом
 * @param {DropdownMenuContentProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={mergeClass(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Пропсы для элемента меню
interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean;
}

/**
 * Элемент выпадающего меню
 * @description Отдельный пункт меню с поддержкой иконок
 * @param {DropdownMenuItemProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={mergeClass(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Пропсы для элемента с чекбоксом
interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {
  checked?: boolean;
}

/**
 * Элемент меню с чекбоксом
 * @description Пункт меню с индикатором чекбокса
 * @param {DropdownMenuCheckboxItemProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={mergeClass(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

// Пропсы для радиокнопки в меню
interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {}

/**
 * Элемент меню с радиокнопкой
 * @description Пункт меню с индикатором радиокнопки
 * @param {DropdownMenuRadioItemProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={mergeClass(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

//  Пропсы для метки в меню
interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean;
}

/**
 * Метка в выпадающем меню
 * @description Заголовок или разделитель в меню
 * @param {DropdownMenuLabelProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={mergeClass("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// Пропсы для разделителя в меню
interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {}

/**
 * Разделитель в выпадающем меню
 * @description Горизонтальная линия для разделения элементов
 * @param {DropdownMenuSeparatorProps} props - Пропсы компонента
 * @param {React.Ref<HTMLElement>} ref - Реф для элемента
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={mergeClass("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

//  Пропсы для ярлыка в меню
interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Ярлык в выпадающем меню
 * @description Текст для отображения горячих клавиш
 * @param {DropdownMenuShortcutProps} props - Пропсы компонента
 */
const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = React.memo(
  ({ className, ...props }) => (
    <span
      className={mergeClass("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};