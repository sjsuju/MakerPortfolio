import { Footer } from "@/components/footer";
import { GearField } from "@/components/gear-field";
import { Navbar } from "@/components/navbar";
import { RevealManager } from "@/components/reveal-manager";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GearField />
      <RevealManager />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
