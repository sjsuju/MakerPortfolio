import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/35 bg-white/[0.055] px-2.5 py-1 font-mono text-[11px] font-medium tracking-tight text-muted-foreground backdrop-blur-2xl transition-colors hover:border-primary/40 hover:text-foreground dark:border-white/[0.14] dark:bg-white/[0.008]",
        className
      )}
      {...props}
    />
  );
}
