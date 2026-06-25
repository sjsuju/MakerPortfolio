"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/78 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-sm text-background">
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
                "rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === item.href && "bg-muted text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
        <div className="border-t bg-background/96 lg:hidden">
          <nav className="container grid gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 text-sm font-medium text-muted-foreground",
                  pathname === item.href && "bg-muted text-foreground"
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
