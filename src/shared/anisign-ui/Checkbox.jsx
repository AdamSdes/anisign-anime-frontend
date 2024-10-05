import { extendVariants, Checkbox } from "@nextui-org/react";

// Создаем кастомный чекбокс с настройками через slots
export const ACheckbox = extendVariants(Checkbox, {
    slots: {
        base: "p-4 bg-red-500",  // Простой стиль для проверки работы слотов
        wrapper: "bg-green-500",
        icon: "text-blue-500",
        label: "text-yellow-500",
    },
    defaultVariants: {
        color: "primary",
        size: "md",
    },
});
