// MyButton.tsx
import {extendVariants, Switch} from "@nextui-org/react";

export const ASwitch = extendVariants(Switch, {
    variants: {
        color: {
            default: {
                wrapper: [
                    "bg-[rgba(255,255,255,0.05)]",
                    "group-data-[selected=true]:bg-[#CCBAE4]",
                ],
                thumb: [
                    "outline-none",
                    "border-none",
                    "bg-[rgba(255,255,255,0.2)]",
                    "group-data-[selected=true]:bg-[#060606]",
                ]
            },
            primary: {
                wrapper: [
                    "group-data-[selected=true]:bg-[#CCBAE4]",
                    "group-data-[selected=true]:text-primary-foreground",
                ],
            },
            secondary: {
                wrapper: [
                    "group-data-[selected=true]:bg-secondary",
                    "group-data-[selected=true]:text-secondary-foreground",
                ],
            },
            success: {
                wrapper: [
                    "group-data-[selected=true]:bg-success",
                    "group-data-[selected=true]:text-success-foreground",
                ],
            },
            warning: {
                wrapper: [
                    "group-data-[selected=true]:bg-warning",
                    "group-data-[selected=true]:text-warning-foreground",
                ],
            },
            danger: {
                wrapper: [
                    "group-data-[selected=true]:bg-danger",
                    "data-[selected=true]:text-danger-foreground",
                ],
            },
        },
        size: {
            sm: {
                wrapper: "w-10 h-6 mr-2 rtl:ml-2 rtl:mr-[unset]",
                thumb: [
                    "w-4 h-4 text-tiny",
                    //selected
                    "group-data-[selected=true]:ml-4 rtl:group-data-[selected=true]:ml-0 rtl:group-data-[selected=true]:mr-4",
                ],
                endContent: "text-tiny",
                startContent: "text-tiny",
                label: "text-small",
            },
            md: {
                wrapper: "w-12 h-7 mr-2 rtl:ml-2 rtl:mr-[unset]",
                thumb: [
                    "w-5 h-5 text-small",
                    //selected
                    "group-data-[selected=true]:ml-5 rtl:group-data-[selected=true]:ml-0 rtl:group-data-[selected=true]:mr-5",
                ],
                endContent: "text-small",
                startContent: "text-small",
                label: "text-medium",
            },
            lg: {
                wrapper: "w-14 h-8 mr-2 rtl:ml-2 rtl:mr-[unset]",
                thumb: [
                    "w-6 h-6 text-medium",
                    //selected
                    "group-data-[selected=true]:ml-6 rtl:group-data-[selected=true]:ml-0 rtl:group-data-[selected=true]:mr-6",
                ],
                endContent: "text-medium",
                startContent: "text-medium",
                label: "text-large",
            },
        },
        isDisabled: {
            true: {
                base: "opacity-disabled pointer-events-none",
            },
        },
        disableAnimation: {
            true: {
                wrapper: "transition-none",
                thumb: "transition-none",
            },
            false: {
                wrapper: "transition-background",
                thumb: "transition-all",
                startContent: [
                    "opacity-0",
                    "scale-50",
                    "transition-transform-opacity",
                    "group-data-[selected=true]:scale-100",
                    "group-data-[selected=true]:opacity-100",
                ],
                endContent: [
                    "opacity-100",
                    "transition-transform-opacity",
                    "group-data-[selected=true]:translate-x-3",
                    "group-data-[selected=true]:opacity-0",
                ],
            },
        },
    },
    defaultVariants: {
        color: "default",
        size: "md",
        isDisabled: false,
    },
    compoundVariants: [
        {
            disableAnimation: false,
            size: "sm",
            class: {
                thumb: ["group-data-[pressed=true]:w-5", "group-data-[selected]:group-data-[pressed]:ml-3"],
            },
        },
        {
            disableAnimation: false,
            size: "md",
            class: {
                thumb: ["group-data-[pressed=true]:w-6", "group-data-[selected]:group-data-[pressed]:ml-4"],
            },
        },
        {
            disableAnimation: false,
            size: "lg",
            class: {
                thumb: ["group-data-[pressed=true]:w-7", "group-data-[selected]:group-data-[pressed]:ml-5"],
            },
        },
    ],
});