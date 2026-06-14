import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

interface CardProps {children : ReactNode; className?: string;}

export const Card = ({ children, className }: CardProps) => {
    return(
        <div className={cn(
            "rounded-xl border border-zinc-800 bg-zinc-900 p-5",
            className
        )}>
            {children}
        </div>
    );
};