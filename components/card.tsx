import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: Readonly<{
  className?: string;
  children: ReactNode;
}>) {
  return (
    <div className={cn("rounded-[28px] border border-border bg-panel/90 p-6 shadow-calm backdrop-blur", className)}>
      {children}
    </div>
  );
}
