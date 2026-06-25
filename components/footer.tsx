import Link from "next/link";
import { navItems } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t bg-white/55">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">Sooraj Sathyajith</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Robotics, assistive tech, AI tools, and web systems.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
