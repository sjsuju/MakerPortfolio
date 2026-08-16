import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-[11px] font-medium tracking-tight text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
