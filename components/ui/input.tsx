import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prependIcon?: ReactNode;
  appendIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prependIcon, appendIcon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-stone-200 bg-transparent px-3 py-1 shadow-sm transition duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-500 focus-within:ring-offset-2 focus-within:duration-150 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:focus-within:ring-stone-500",
          className
        )}
      >
        {prependIcon}
        <input
          type={type}
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-stone-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-stone-400"
          {...props}
        />
        {appendIcon}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
