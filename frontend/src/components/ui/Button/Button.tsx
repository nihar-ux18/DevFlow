import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";
type Variant = "primary"|"secondary"|"ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant ?: Variant;
}

export const Button = ({ variant = "primary", className, ...props}: ButtonProps)=>{
    return (
        <button 
            className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                variant == "primary" &&
                    "bg-blue-500 text-white hover:bg-blue-600",
                variant == "secondary" &&
                    "bg-zinc-800 text-white hover:bg-zinc-700",
                variant == "ghost" &&
                    "bg-zinc-800 hover:bg-zinc-300",
                    className
            )}
            {...props}
            />
    )
}