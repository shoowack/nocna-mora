import { cn } from "@/lib/utils";
import { FC, PropsWithChildren } from "react";

export const Container: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full xl:max-w-6xl lg:max-w-4xl flex-auto px-4 py-4 sm:px-6 md:py-16",
        className
      )}
    >
      {children}
    </div>
  );
};
