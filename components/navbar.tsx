"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-bar sticky top-0 z-50 border-b border-white/50 dark:border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-display font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-mono text-sm text-background">
            SS
          </span>
          <span className="hidden sm:inline">Sooraj Sathyajith</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground",
                pathname === item.href && "bg-muted/70 text-primary"
              )}
            >
              {pathname === item.href ? (
                <span aria-hidden="true" className="mr-1.5 text-hazard">
                  {"//"}
                </span>
              ) : null}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="glass-bar border-t border-white/50 dark:border-white/10 lg:hidden">
          <nav className="container grid gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
                  pathname === item.href && "bg-muted/70 text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
