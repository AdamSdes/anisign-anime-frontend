// MyButton.tsx
import {extendVariants, Dropdown} from "@nextui-org/react";

export const ADropdown = extendVariants(Dropdown, {
    variants: {
        color: {
            white: "bg-[#101010] h-full",
            gray: "bg-[rgba(255,255,255,0.03)] text-white/70",
            violet: "bg-[#8b5cf6] text-[#fff]",
            border: "bg-[none] border border-white/5 hover:bg-white/5",
        },
        isDisabled: {
            true: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed",
        },
        size: {
            xl: "p-2",
        },
    },
    defaultVariants: {
        color: "white",
        size: "xl",
    },
    compoundVariants: [
        {
            isDisabled: true,
            color: "olive",
            class: "bg-[#84cc16]/80 opacity-100",
        },
    ],
});