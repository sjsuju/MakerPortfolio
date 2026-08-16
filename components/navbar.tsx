"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems, projects } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="glass-bar sticky top-0 z-50 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          data-tooltip="Back to home"
          className="flex items-center gap-3 font-display font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-mono text-sm text-background">
            SS
          </span>
          <span className="hidden sm:inline">Sooraj Sathyajith</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const link = (
              <Link
                href={item.href}
                className={cn(
                  "nav-link rounded-md px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground",
                  active && "bg-muted/70 text-primary"
                )}
              >
                {active ? (
                  <span aria-hidden="true" className="mr-1.5 text-hazard">
                    {"//"}
                  </span>
                ) : null}
                {item.label}
              </Link>
            );

            if (item.href !== "/projects") {
              return <div key={item.href}>{link}</div>;
            }

            return (
              <div key={item.href} className="group relative">
                {link}
                <div className="invisible absolute left-0 top-full z-50 min-w-56 origin-top -translate-y-1 scale-[0.97] pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-lg border border-border bg-card/90 shadow-glow backdrop-blur-xl">
                    {projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="block px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                      >
                        {project.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            data-tooltip={open ? "Close menu" : "Open menu"}
            data-tooltip-end=""
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="glass-bar border-t border-border lg:hidden">
          <nav className="container grid gap-1 py-3">
            {navItems.map((item) => (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block flex-1 rounded-md px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
                      isActive(item.href) && "bg-muted/70 text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.href === "/projects" ? (
                    <button
                      type="button"
                      aria-label={projectsOpen ? "Hide projects" : "Show projects"}
                      data-tooltip={projectsOpen ? "Hide projects" : "Show projects"}
                      data-tooltip-end=""
                      aria-expanded={projectsOpen}
                      onClick={() => setProjectsOpen((value) => !value)}
                      className="rounded-md p-3 text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", projectsOpen && "rotate-180")}
                      />
                    </button>
                  ) : null}
                </div>
                {item.href === "/projects" && projectsOpen ? (
                  <div className="mt-1 grid gap-0.5 pl-4">
                    {projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70 transition-colors hover:text-foreground"
                      >
                        {project.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
