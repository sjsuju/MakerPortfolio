import Link from "next/link";
import { navItems } from "@/lib/data";

export function Footer() {
  return (
    <footer className="glass-bar border-t border-border">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display font-semibold">Sooraj Sathyajith</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span aria-hidden="true" className="mr-2 text-hazard">
              {"//"}
            </span>
            Portland, OR &middot; building since 2023
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
