import { ButtonProps } from "@/components/ui/button";

export interface PaginationLinkProps extends React.ComponentProps<"a">, Pick<ButtonProps, "size"> {
    isActive?: boolean;
}