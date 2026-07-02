import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/55 bg-white/[0.34] px-2.5 py-1 font-mono text-[11px] font-medium tracking-tight text-muted-foreground backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08]",
        className
      )}
      {...props}
    />
  );
}
