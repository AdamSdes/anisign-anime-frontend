import {extendVariants, Button} from "@nextui-org/react";

export const AButton = extendVariants(Button, {
    variants: {
        color: {
            white: "text-[#000] font-semibold bg-[#DEDEDF] hover:bg-[#CCBAE4]",
            gray: "bg-[rgba(255,255,255,0.03)] text-white/70",
            violet: "bg-[#8b5cf6] text-[#fff]",
            border: "bg-[none] border border-white/5 hover:bg-white/5",
        },
        isDisabled: {
            true: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed",
        },
        size: {
            xs: "px-2 h-6 text-tiny gap-1 rounded-small",
            md: "px-4 h-10 text-small gap-2 rounded-[12px]",
            xl: "px-8 h-14 text-[16px] gap-4 rounded-medium",
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