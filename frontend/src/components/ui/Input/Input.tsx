import type { InputHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export const Input = ({ className, ...props } : InputHTMLAttributes<HTMLInputElement>) => {
    return(
        <input className={cn( "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 outline:none focus:ring-2 focus:ring-blue-500", className
        )}
        {...props}
        />
    );
};