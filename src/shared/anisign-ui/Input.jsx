// MyButton.tsx
import {extendVariants, Input} from "@nextui-org/react";

export const AInput = extendVariants(Input, {
    variants: {
        color: {
            stone: {
                inputWrapper: [
                    "bg-[none]",
                    "border",
                    "transition-colors",
                    "focus-within:bg-[rgba(255,255,255,0.02)]",
                    "data-[hover=true]:border-white/5",
                    "data-[hover=true]:bg-zinc-100",
                    "group-data-[focus=true]:border-white/10",
                    "dark:data-[hover=true]:bg-[rgba(255,255,255,0.02)]",
                    "dark:focus-within:bg-[rgba(255,255,255,0.02)]",
                ],
                input: [
                    "text-white/60",
                    "placeholder:text-zinc-600",
                    "dark:text-white/60",
                    "m-[10px]",
                    "dark:placeholder:text-white/40",
                ],
            },
        },
        size: {
            xs: {
                inputWrapper: "h-6 min-h-6 px-1",
                input: "text-tiny",
            },
            md: {
                inputWrapper: "h-10 min-h-10",
                input: "text-small",
            },
            xl: {
                inputWrapper: "h-[60px] px-4 min-h-14",
                input: "text-medium",
            },
        },
        radius: {
            xs: {
                inputWrapper: "rounded",
            },
            sm: {
                inputWrapper: "rounded-[4px]",
            },
        },
        textSize: {
            base: {
                input: "text-base",
            },
        },
        removeLabel: {
            true: {
                label: "hidden",
            },
            false: {},
        },
        isInvalid: {
            true: {
                label: "!text-danger",
                input: "!placeholder:text-danger !text-danger",
            },
        },
    },

    defaultVariants: {
        color: "stone",
        textSize: "base",
        removeLabel: true,
        isInvalid: false,
    },

});